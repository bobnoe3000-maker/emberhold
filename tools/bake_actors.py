from PIL import Image
import json, os, re
OUT="/home/user/emberhold/assets"
HERO_SRC="isometric_hero"

# ---------- HERO: composite kit from the 8x32 / 128px grid ----------
CELL=128; DIRS=8
# clip layout (Flare avatar convention, matches the pack visually)
HERO_CLIPS={"idle":(0,4,6),"walk":(4,8,12),"attack":(12,4,14)}   # start,len,fps
USED=list(range(0,16))                                            # idle+walk+attack columns
LAYERS=["steel_armor","longsword","shield","male_head1"]          # draw order (back->front)
def hcell(name,d,f):
    return Image.open(f"{HERO_SRC}/{name}.png").convert("RGBA").crop((f*CELL,d*CELL,(f+1)*CELL,(d+1)*CELL))
def hcompo(d,f):
    im=Image.new("RGBA",(CELL,CELL),(0,0,0,0))
    for L in LAYERS: im.alpha_composite(hcell(L,d,f))
    return im
# union bbox across all used cells → fixed crop
ux0=uy0=10**9; ux1=uy1=-10**9
for d in range(DIRS):
    for f in USED:
        b=hcompo(d,f).getbbox()
        if b: ux0=min(ux0,b[0]);uy0=min(uy0,b[1]);ux1=max(ux1,b[2]);uy1=max(uy1,b[3])
pad=2; ux0-=pad;uy0-=pad;ux1+=pad;uy1+=pad
CW,CH=ux1-ux0,uy1-uy0
NF=len(USED)
atlas=Image.new("RGBA",(CW*NF,CH*DIRS),(0,0,0,0))
for d in range(DIRS):
    for j,f in enumerate(USED):
        atlas.alpha_composite(hcompo(d,f).crop((ux0,uy0,ux1,uy1)),(j*CW,d*CH))
atlas.save(f"{OUT}/hero/knight.png")
# feet anchor: bottom-center of union (a hair above the very bottom)
hero_meta={"cw":CW,"ch":CH,"dirs":DIRS,"frames":NF,"ax":CW//2,"ay":CH-3,
           "clips":{k:{"start":USED.index(s),"len":l,"fps":fp} for k,(s,l,fp) in HERO_CLIPS.items()}}
json.dump(hero_meta,open(f"{OUT}/hero/knight.json","w"))
print("hero atlas",CW,"x",CH,"cells, sheet",atlas.size)

# ---------- SKELETON: parse Flare packer atlas + anim def, scale to our size ----------
def parse_flare(txt):
    img=None; anims={}; cur=None
    for ln in open(txt):
        ln=ln.strip()
        if ln.startswith("image="): img=ln.split("=",1)[1]
        m=re.match(r"\[(\w+)\]",ln)
        if m: cur=m.group(1); anims[cur]={"frames":0,"cells":{}}
        elif ln.startswith("frames="): anims[cur]["frames"]=int(ln.split("=")[1])
        elif ln.startswith("frame="):
            v=[int(x) for x in ln.split("=")[1].split(",")]
            idx,d,x,y,w,h,ox,oy=v
            anims[cur]["cells"][(d,idx)]=(x,y,w,h,ox,oy)
    return img,anims
simg,anims=parse_flare("skeleton.txt")
sk=Image.open("skeleton.png").convert("RGBA")
SK_CLIPS={"idle":"stance","walk":"run"}
TARGET_H=58.0
# scale so the tallest used frame is TARGET_H
maxh=max(anims[a]["cells"][(d,i)][3] for a in SK_CLIPS.values() for (d,i) in anims[a]["cells"])
sc=TARGET_H/maxh
NFs=max(anims[a]["frames"] for a in SK_CLIPS.values())
# cell big enough for scaled frames + offset placement
CWs=int(max(w for a in SK_CLIPS.values() for (_,_,w,_,_,_) in anims[a]["cells"].values())*sc)+6
CHs=int(TARGET_H)+8
AXs,AYs=CWs//2,CHs-3
order=list(SK_CLIPS.items())
sheet=Image.new("RGBA",(CWs*NFs,CHs*DIRS*len(order)),(0,0,0,0))
sk_clip_meta={}
for ci,(name,anim) in enumerate(order):
    A=anims[anim]; sk_clip_meta[name]={"start":0,"len":A["frames"],"fps":round(A["frames"]/0.533)}
    rowbase=ci*DIRS
    for d in range(DIRS):
        for i in range(A["frames"]):
            x,y,w,h,ox,oy=A["cells"][(d,i)]
            fr=sk.crop((x,y,x+w,y+h)).resize((max(1,int(w*sc)),max(1,int(h*sc))),Image.LANCZOS)
            # pivot (ox,oy) scaled → place at cell anchor (AXs,AYs)
            dx=int(AXs-ox*sc); dy=int(AYs-oy*sc)
            cell=Image.new("RGBA",(CWs,CHs),(0,0,0,0)); cell.alpha_composite(fr,(dx,dy))
            sheet.alpha_composite(cell,(i*CWs,(rowbase+d)*CHs))
sheet.save(f"{OUT}/enemy/skeleton.png")
sk_meta={"cw":CWs,"ch":CHs,"dirs":DIRS,"frames":NFs,"ax":AXs,"ay":AYs,
         "cliporder":[n for n,_ in order],"clips":sk_clip_meta}
json.dump(sk_meta,open(f"{OUT}/enemy/skeleton.json","w"))
print("skeleton atlas",CWs,"x",CHs,"scale %.3f"%sc,"sheet",sheet.size)
