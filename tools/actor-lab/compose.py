"""compose.py — look-dev boards from render.cjs output (Pillow).

  out/board_heroes.png   fighter / rogue / mage loadouts, stock vs heroic
  out/board_enemies.png  undead + recolored-human NPCs, stock vs heroic
  out/board_inworld.png  heroic party vs horde over out/backdrop.png (capture-backdrop.cjs)

Applies the option-C 'grim' pass: 42% desaturation, cool tint, 1px ink outline;
pixels brighter than 225 (glowing eyes / orbs) are left hot.
"""
import os
from PIL import Image, ImageDraw, ImageFont
import json
HERE=os.path.dirname(os.path.abspath(__file__)); O=os.path.join(HERE,"out"); SP=O
F=lambda s,b=False: ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if b else ''}.ttf",s)
BG=(14,10,20,255); PANEL=(34,27,46,255); INK=(8,5,14,255); GOLD=(240,165,0,255); CREAM=(240,226,200,255); DIM=(160,150,180,255)
V={v["id"]:v for v in json.load(open(os.path.join(HERE,"variants.json")))}
W,H,ANCH=72,84,(36,78)

def grim(im):
    p=im.load(); o=im.copy(); q=o.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r,g,b,a=p[x,y]
            if not a or max(r,g,b)>225: continue          # keep glows (eyes, orbs) hot
            L=0.3*r+0.59*g+0.11*b; k=0.42
            q[x,y]=(int((r+(L-r)*k)*0.92),int((g+(L-g)*k)*0.87),int((b+(L-b)*k)*1.0),a)
    a=o.split()[3]; ap=a.load(); oo=o.copy(); op=oo.load()
    for y in range(H):
        for x in range(W):
            if ap[x,y]==0 and any(0<=x+dx<W and 0<=y+dy<H and ap[x+dx,y+dy]>0 for dx,dy in((1,0),(-1,0),(0,1),(0,-1))): op[x,y]=INK
    return oo
def spr(vid,prop,d): return grim(Image.open(f"{O}/{vid}__{prop}__{d}.png").convert("RGBA"))

CX0,CY0,CX1,CY1=6,12,66,82
def lineup(title,sub,groups,d,Z=4,fn="x.png"):
    cw=(CX1-CX0)*Z; ch=(CY1-CY0)*Z; gap=10; gg=36
    ncol=sum(len(ids) for _,ids in groups); Wt=200+ncol*(cw+gap)+(len(groups)-1)*gg+30
    Ht=150+2*(ch+70)+40
    img=Image.new("RGBA",(Wt,Ht),BG); dr=ImageDraw.Draw(img)
    dr.text((24,22),title,font=F(34,True),fill=GOLD); dr.text((24,70),sub,font=F(20),fill=DIM)
    for r,(prop,rl) in enumerate([("stock","Stock\nKayKit"),("heroic","Heroic\nsmaller head\nlonger limbs")]):
        y=150+r*(ch+70); dr.text((20,y+ch//2-40),rl,font=F(21,True),fill=CREAM)
        x=200
        for gi,(gname,ids) in enumerate(groups):
            if r==0: dr.text((x,122),gname.upper(),font=F(22,True),fill=GOLD)
            for vid in ids:
                dr.rectangle([x,y,x+cw,y+ch],fill=PANEL)
                img.alpha_composite(spr(vid,prop,d).crop((CX0,CY0,CX1,CY1)).resize((cw,ch),Image.NEAREST),(x,y))
                if r==1: 
                    lab=V[vid]["label"]; dr.text((x+6,y+ch+8),lab if len(lab)<24 else lab[:23]+"…",font=F(17),fill=DIM)
                x+=cw+gap
            x+=gg-gap
    img.convert("RGB").save(f"{SP}/{fn}"); print(fn,img.size)

lineup("Option C · Heroes — fighter / rogue / mage","KayKit CC0 models · 'grim' pass (desaturated + ink outline) · 3/4 view at true 46px scale, shown 4×",
       [("Fighter",["F1","F2","F3","F4"]),("Rogue",["R1","R2","R3"]),("Mage",["M1","M2","M3"])],0,fn="board_heroes.png")
lineup("Option C · Enemy NPCs","Undead from the KayKit Skeletons pack (themed glowing eyes) · Humans are recolored hero models — no extra art needed",
       [("Undead",["E1","E2","E3","E4"]),("Human",["E5","E6","E7","E8"])],0,fn="board_enemies.png")

# ---- in-world: heroic party vs horde on the real in-engine backdrop ----
S=3; base=Image.open(f"{O}/backdrop.png").convert("RGBA")
cast=[("M1",2,(236,902)),("F1",2,(352,988)),("R2",2,(452,918)),          # party, facing right
      ("E5",0,(566,884)),("E6",0,(706,862)),("E1",0,(626,986)),("E2",0,(742,1002))]   # horde, facing left
for vid,d,(fx,fy) in sorted(cast,key=lambda c:c[2][1]):
    s=spr(vid,"heroic",d).resize((W*S,H*S),Image.NEAREST); base.alpha_composite(s,(fx-ANCH[0]*S,fy-ANCH[1]*S))
c=base.crop((110,650,800,1110)); c=c.resize((c.width*2,c.height*2),Image.NEAREST)
out=Image.new("RGBA",(c.width,c.height+120),BG); out.alpha_composite(c,(0,120)); dr=ImageDraw.Draw(out)
dr.text((24,20),"Option C · heroic proportions, in-world",font=F(34,True),fill=GOLD)
dr.text((24,70),"mage · knight · hooded rogue   vs   necromancer · skeleton warrior · skeleton minion · cultist",font=F(21),fill=DIM)
out.convert("RGB").save(f"{O}/board_inworld.png"); print("board_inworld.png",out.size)
