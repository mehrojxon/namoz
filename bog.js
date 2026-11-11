/* Jannat sari — "Bog‘" tasbeh ko‘rinishi: sanoq oshgani sari quruq yer Jannat bog‘iga aylanadi (Three.js r128, 3D) */
(function(){
if(window.BOG)return;
function cl(x,a,b){return Math.max(a,Math.min(b,x))}
function sm(a,b,x){x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)}
function lerp(a,b,t){return a+(b-a)*t}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var inst=null,host=null;
function* init(app,cv){
var pd=0,tgt=0;
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'})}catch(e){return null}
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=THREE.PCFShadowMap;var QI=[],QT=0,MOB=(('ontouchstart' in window)||navigator.maxTouchPoints>0);function qSet(t){QT=t;var f=[1,.7,.45][t];QI.forEach(function(m){m[0].count=Math.max(1,Math.floor(m[1]*f))})}

/* ---------- shared uniforms ---------- */
var POOL=new THREE.Vector3(-1.3,0,-2.4);
var U={uT:{value:0},uP:{value:0},uFront:{value:0},uPool:{value:POOL},uR:{value:.3},uG:{value:.1},uL:{value:0},uFlow:{value:.1},uSun:{value:new THREE.Vector3()}};
var scene=new THREE.Scene();scene.fog=new THREE.Fog(0xb8a886,22,120);
var camera=new THREE.PerspectiveCamera(74,.5,.1,400);

/* ---------- GLSL noise ---------- */
var NOISE=[
'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
'vec2 h22(vec2 p){float n=h21(p);return vec2(n,h21(p+n+17.3));}',
'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}',
'float fbm(vec2 p){float a=.57,s=0.;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.03+11.7;a*=.5;}return s;}',
'vec3 voro(vec2 x){vec2 n=floor(x),f=fract(x),mg=vec2(0.),mr=vec2(0.);float md=8.;',
' for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=h22(n+g);vec2 r=g+o-f;float d=dot(r,r);if(d<md){md=d;mr=r;mg=g;}}',
' md=8.;for(int j=-2;j<=2;j++)for(int i=-2;i<=2;i++){vec2 g=mg+vec2(float(i),float(j));vec2 o=h22(n+g);vec2 r=g+o-f;if(dot(mr-r,mr-r)>1e-5)md=min(md,dot(.5*(mr+r),normalize(r-mr)));}',
' return vec3(md,mr);}',
'vec3 voro2(vec2 x){vec2 n=floor(x),f=fract(x),mg=vec2(0.),mr=vec2(0.);float md=8.;',
' for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=h22(n+g);vec2 r=g+o-f;float d=dot(r,r);if(d<md){md=d;mr=r;mg=g;}}',
' md=8.;for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=mg+vec2(float(i),float(j));vec2 o=h22(n+g);vec2 r=g+o-f;if(dot(mr-r,mr-r)>1e-5)md=min(md,dot(.5*(mr+r),normalize(r-mr)));}',
' return vec3(md,mr);}'
].join('\n');

function patch(mat,o){
  mat.onBeforeCompile=function(sh){
    for(var k in U)sh.uniforms[k]=U[k];
    if(o.vdecl)sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\n'+o.vdecl);
    if(o.vbody)sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>',o.vbody);
    if(o.vproj)sh.vertexShader=sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n'+o.vproj);
    if(o.fdecl)sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\n'+NOISE+'\n'+o.fdecl);
    if(o.fmap)sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>',o.fmap);
    if(o.frough)sh.fragmentShader=sh.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n'+o.frough);
    if(o.fnorm)sh.fragmentShader=sh.fragmentShader.replace('#include <normal_fragment_maps>',o.fnorm);
  };
  mat.customProgramCacheKey=function(){return o.key||'k'};
}

yield;
/* ---------- sky ---------- */
var skyU={uHor:{value:new THREE.Color()},uZen:{value:new THREE.Color()},uSunCol:{value:new THREE.Color()},uCloud:{value:.3},uCL:{value:new THREE.Color()},uCD:{value:new THREE.Color()}};
var sky=new THREE.Mesh(new THREE.SphereGeometry(200,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:Object.assign({uT:U.uT,uSun:U.uSun},skyU),
  vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:NOISE+'\nuniform vec3 uHor,uZen,uSunCol,uSun,uCL,uCD;uniform float uT,uCloud;varying vec3 vD;\n'+
  'void main(){vec3 d=normalize(vD);float h=clamp(d.y,0.,1.);vec3 col=mix(uHor,uZen,pow(h,.33));'+
  'float sd=max(dot(d,uSun),0.);col+=uSunCol*(pow(sd,6.)*.12+pow(sd,60.)*.4+pow(sd,900.)*3.+smoothstep(.99965,.9999,sd)*9.);'+
  'vec2 cp=d.xz/(d.y+.28)*1.5+vec2(uT*.006,0.);float c=fbm(cp*1.1);c=smoothstep(.48,.78,c)*smoothstep(.02,.22,d.y)*uCloud;'+
  'vec3 cc=mix(uCD,uCL,clamp(.35+sd*.9,0.,1.));col=mix(col,cc,c*.85);'+
  'col=mix(col,uHor*.92,smoothstep(0.,-.12,d.y));gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'}));
sky.renderOrder=-1;scene.add(sky);

yield;
/* ---------- lights ---------- */
var SUNDIR=new THREE.Vector3(.8,.5,.12).normalize();U.uSun.value.copy(SUNDIR);
var sun=new THREE.DirectionalLight(0xffd9a0,1);sun.castShadow=true;
sun.shadow.mapSize.set(MOB?1024:1536,MOB?1024:1536);var sc2=sun.shadow.camera;sc2.left=-14;sc2.right=14;sc2.top=14;sc2.bottom=-14;sc2.near=1;sc2.far=80;
sun.shadow.bias=-.0006;sun.shadow.normalBias=.04;
sun.position.copy(SUNDIR).multiplyScalar(38).add(new THREE.Vector3(-1,0,-3));sun.target.position.set(-1,0,-3);scene.add(sun,sun.target);
var hemi=new THREE.HemisphereLight(0xbfd0e6,0x6a5a42,.6);scene.add(hemi);
var fillL=new THREE.DirectionalLight(0xfff0dd,.25);fillL.position.set(2,3,9);scene.add(fillL);

yield;
/* ---------- ground ---------- */
function makeCrackTex(){
  var N=512,C=4,r=rng(123),pts=[],i,x,y;for(i=0;i<C*C;i++)pts.push([r(),r()]);
  function P(ix,iy){ix=((ix%C)+C)%C;iy=((iy%C)+C)%C;return pts[iy*C+ix]}
  var data=new Uint8Array(N*N*4);
  for(y=0;y<N;y++)for(x=0;x<N;x++){
    var u=(x+.5)/N*C,v=(y+.5)/N*C,cx=Math.floor(u),cy=Math.floor(v),fu=u-cx,fv=v-cy,md=9,mrx=0,mry=0,mid=0,j,k;
    for(j=-1;j<=1;j++)for(k=-1;k<=1;k++){var q=P(cx+k,cy+j),rx=k+q[0]-fu,ry=j+q[1]-fv,d=rx*rx+ry*ry;if(d<md){md=d;mrx=rx;mry=ry;mid=(((cy+j)%C+C)%C)*C+(((cx+k)%C+C)%C)}}
    var ed=9;for(j=-2;j<=2;j++)for(k=-2;k<=2;k++){var q2=P(cx+k,cy+j),rx2=k+q2[0]-fu,ry2=j+q2[1]-fv,dx=rx2-mrx,dy=ry2-mry,dl=Math.sqrt(dx*dx+dy*dy);
      if(dl>1e-4){var e=((mrx+rx2)*.5*dx+(mry+ry2)*.5*dy)/dl;if(e<ed)ed=e}}
    var o=(y*N+x)*4;data[o]=Math.min(255,ed/.5*255);data[o+1]=(mid*97%255);data[o+2]=Math.min(255,Math.sqrt(md)*255);data[o+3]=255}
  var t=new THREE.DataTexture(data,N,N,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.needsUpdate=true;return t}
U.uCrack={value:makeCrackTex()};
var groundMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.95,metalness:0});
patch(groundMat,{key:'ground2',vdecl:'varying vec2 vWP;',vproj:'vWP=(modelMatrix*vec4(transformed,1.)).xz;',
 fdecl:'uniform float uP,uFront,uT;uniform vec3 uPool;uniform sampler2D uCrack;varying vec2 vWP;float htf(float d,float cw){return -(1.-smoothstep(0.,cw,d))*.55+smoothstep(0.,.4,d)*.28;}',
 fmap:[
 'vec2 q=vWP;vec2 w1=vec2(fbm(q*.7),fbm(q*.7+7.3))-.5;',
 'vec2 uv1=(q+w1*1.1)/3.6;vec4 t1=texture2D(uCrack,uv1);float d1=t1.r*.5;',
 'vec4 t2=texture2D(uCrack,(q*1.9+w1*1.4+vec2(3.1,1.7))/3.6);float d2=t2.r*.5;',
 'float cw1=.05+.06*vn(q*2.1);float cr1=1.-smoothstep(0.,cw1,d1);',
 'float vd=length(vViewPosition);',
 'float cr2=(1.-smoothstep(0.,.05,d2))*.55*smoothstep(.08,.22,d1)*(1.-smoothstep(3.,9.,vd));',
 'float crack=max(cr1,cr2);float plate=smoothstep(0.,.4,d1);float far=smoothstep(16.,48.,vd);',
 'float dd=length(q-uPool.xz);float nz=fbm(q*.45+3.)*2.2;float fc=uFront+nz*1.6;float act=smoothstep(.25,.9,uFront);',
 'float seep=smoothstep(fc,fc-2.2,dd);',
 'float crackWet=crack*seep;',
 'float mudBand=(1.-smoothstep(0.,1.2,d1))*smoothstep(fc*.98,fc*.92-3.,dd);',
 'float areaWet=smoothstep(uFront*.62+.6+nz*.6,uFront*.62-1.5,dd);',
 'float mud=clamp(max(mudBand*1.,areaWet*1.1),0.,1.)*act;float Wt=clamp(max(mud,crackWet*act),0.,1.);',
 'vec3 dry=mix(vec3(.62,.50,.37),vec3(.45,.36,.27),fbm(q*1.3));dry*=(.82+.34*fbm(q*7.))*(.92+.16*t1.g);dry=mix(dry,vec3(.74,.64,.52),plate*.14);',
 'vec3 wcol=vec3(.3,.36,.38)*(.7+.7*fbm(q*1.6+vec2(uT*.012,0.)));',
 'vec3 ccol=mix(vec3(.045,.036,.028),wcol,clamp(crackWet*act,0.,1.)*.9);vec3 col=mix(dry,ccol,crack*.95);',
 'vec3 mudc=vec3(.15,.105,.07)*(.8+.4*fbm(q*3.));col=mix(col,mudc,mud*(1.-crack*.6)*.97);float gf=smoothstep(.3,.92,uP)*smoothstep(fc,fc-7.,dd);col=mix(col,vec3(.13,.2,.06)*(.65+.7*fbm(q*4.)),clamp(gf*(1.-crack*.8),0.,1.)*.85);',
 'float gm=smoothstep(.28,.9,uP)*Wt*(.55+fbm(q*2.6));col=mix(col,vec3(.11,.19,.055)*(.7+fbm(q*15.)*.7),clamp(gm*(1.-crack*.85),0.,1.)*.8);',
 'col=mix(col,mix(vec3(.5,.42,.32),vec3(.2,.3,.14),Wt*smoothstep(.3,.9,uP)),far*.75);',
 'diffuseColor.rgb*=col;'].join('\n'),
 frough:'roughnessFactor=mix(.95,.1,max(mud*.8,Wt*crack));roughnessFactor=mix(roughnessFactor,.95,far);',
 fnorm:['float e_=.03/3.6;float hc=htf(d1,cw1),hx=htf(texture2D(uCrack,uv1+vec2(e_,0.)).r*.5,cw1),hz=htf(texture2D(uCrack,uv1+vec2(0.,e_)).r*.5,cw1);',
  'vec3 gw=vec3(hx-hc,0.,hz-hc)/.03;vec3 gv=(viewMatrix*vec4(gw,0.)).xyz;gv-=dot(gv,normal)*normal;normal=normalize(normal-.45*(1.-far)*(1.-mud*.6)*gv);'].join('\n')});
var ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

yield;
/* ---------- distant hills ---------- */
var hillU={uFog:{value:new THREE.Color()}};var hills=[];
[[-85,4,.0,0],[-115,11,.7,1],[-150,22,1.9,2]].forEach(function(h,i){
  var g=new THREE.PlaneGeometry(520,60,160,1),r=rng(90+i),ph=[r()*9,r()*9,r()*9];
  for(var j=0;j<=160;j++){var x=-260+j*3.25,hh=11*ridge(x*.011+ph[0],i)+5*ridge(x*.034+ph[1],i+3)+2*vn3(x*.11,i,1)+9;g.attributes.position.setY(j,hh+h[1]);g.attributes.position.setY(j+161,-6)}
  var m=new THREE.Mesh(g,new THREE.ShaderMaterial({fog:false,depthWrite:true,uniforms:{uTop:{value:new THREE.Color()},uFog:hillU.uFog,uK:{value:.3+i*.2}},
   vertexShader:'varying vec2 vU;varying vec3 vW;void main(){vU=uv;vW=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:NOISE+'\nuniform vec3 uTop,uFog;uniform float uK;varying vec2 vU;varying vec3 vW;void main(){float n=fbm(vec2(vW.x*.05,vW.y*.12));float g=smoothstep(.1,.98,vU.y);vec3 c=mix(uFog,uTop*(.8+.4*n),g);c=mix(uFog,c,1.-uK*.7);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'}));
  m.position.set(0,0,h[0]);scene.add(m);hills.push(m)});

yield;
/* ---------- rocks & cliff ---------- */
function n3(x,y,z){var s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s)}
function vn3(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;xf=xf*xf*(3-2*xf);yf=yf*yf*(3-2*yf);zf=zf*zf*(3-2*zf);
  function L(a,b,t){return a+(b-a)*t}
  return L(L(L(n3(xi,yi,zi),n3(xi+1,yi,zi),xf),L(n3(xi,yi+1,zi),n3(xi+1,yi+1,zi),xf),yf),L(L(n3(xi,yi,zi+1),n3(xi+1,yi,zi+1),xf),L(n3(xi,yi+1,zi+1),n3(xi+1,yi+1,zi+1),xf),yf),zf)}
var ROCKN=['float h31(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}',
'float vn3g(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}',
'float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn3g(p);p=p*2.07+5.3;a*=.5;}return s;}','float rh(vec3 p){return vn3g(p*1.3)*.5+vn3g(p*3.6+3.)*.3+vn3g(p*8.+1.)*.16+vn3g(p*19.)*.07;}'].join('\n');
var rockMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:0,vertexColors:true});
patch(rockMat,{key:'rock',vdecl:'varying vec3 vWp;',vproj:'vWp=(modelMatrix*vec4(transformed,1.)).xyz;',
 fdecl:ROCKN+'\nuniform float uP,uFlow;uniform vec3 uPool;varying vec3 vWp;',
 fmap:['vec3 wp=vWp;float n1=vn3g(wp*1.2)*.62+vn3g(wp*2.6+2.)*.38,n2=vn3g(wp*3.2+3.),n3_=vn3g(wp*9.+1.);',
 'float strata=sin(wp.y*6.+n1*5.)*.5+.5;',
 'vec3 rc=mix(vec3(.17,.15,.13),vec3(.4,.35,.29),smoothstep(.25,.75,n1));rc=mix(rc,vec3(.2,.18,.16),strata*.4*smoothstep(.3,.7,n2));rc*=.88+.24*n3_;',
 'float rid=1.-abs(vn3g(wp*2.2+7.)*2.-1.);rid=smoothstep(.8,.96,rid);rc*=1.-rid*.5;',
 'float dxw=abs(wp.x-uPool.x);float wetF=smoothstep(1.2,.2,dxw)*smoothstep(3.5,3.0,wp.y)*(.3+.7*uFlow);',
 'float splash=smoothstep(1.9,.1,wp.y)*smoothstep(3.6,1.,length(wp.xz-uPool.xz))*uFlow;',
 'float wet=clamp(wetF+splash*.85,0.,1.);',
 'float moss=smoothstep(.36,.62,vn3g(wp*2.2+11.)*.65+vn3g(wp*5.+2.)*.35)*(.25+.75*wet)*smoothstep(.15,.85,uP)*smoothstep(3.2,.2,wp.y+n2);',
 'rc=mix(rc,vec3(.1,.2,.05)*(.6+n3_),clamp(moss,0.,1.)*.85);rc*=mix(1.,.42,wet);',
 '',
 'diffuseColor.rgb*=rc;'].join('\n'),
 frough:'roughnessFactor=mix(.93,.16,wet*.85);',
 fnorm:['float e_=.035;float h0=rh(wp);vec3 gw=vec3(rh(wp+vec3(e_,0.,0.))-h0,rh(wp+vec3(0.,e_,0.))-h0,rh(wp+vec3(0.,0.,e_))-h0)/e_;',
  'vec3 gv=(viewMatrix*vec4(gw,0.)).xyz;gv-=dot(gv,normal)*normal;normal=normalize(normal-.32*gv);'].join('\n')});
function polyRock(seed,sx,sy,sz){
  var r=rng(seed),pl=[],i;for(i=0;i<8;i++){var a=r()*6.283,b=Math.acos(r()*2-1);pl.push([new THREE.Vector3(Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)),.78+r()*.3])}
  pl.push([new THREE.Vector3(0,1,0),.6+r()*.15],[new THREE.Vector3(0,-1,0),.5]);
  var g=new THREE.SphereGeometry(1,56,40),p=g.attributes.position,d=new THREE.Vector3();
  for(i=0;i<p.count;i++){d.set(p.getX(i),p.getY(i),p.getZ(i)).normalize();var sum=0;
    pl.forEach(function(q){var c=d.dot(q[0]),rr=c>.02?Math.min(q[1]/c,6):6;sum+=Math.exp(-9*rr)});
    var rad=-Math.log(sum)/9;rad*=1+(vn3(d.x*2.6+seed,d.y*2.6,d.z*2.6)-.5)*.14+(vn3(d.x*7+seed,d.y*7,d.z*7)-.5)*.05;
    p.setXYZ(i,d.x*rad*sx,d.y*rad*sy,d.z*rad*sz)}
  var cc=new Float32Array(p.count*3);for(i=0;i<p.count;i++){var sh=.8+.4*vn3(p.getX(i)*1.5+seed,p.getY(i)*1.5,p.getZ(i)*1.5);cc[i*3]=sh;cc[i*3+1]=sh;cc[i*3+2]=sh}g.setAttribute('color',new THREE.BufferAttribute(cc,3));
  g.computeVertexNormals();return g}
/* cliff wall: displaced grid with strata, a groove for the water and an overhanging lip */
var LIPY=3.4,FXc=POOL.x;
function ridge(t,k){var v=1-Math.abs(vn3(t,k,0)*2-1);return v*v}
function blk(X,Y){ /* irregular sedimentary blocks: warped joints, varying row heights and widths */
  var Xw=X+(vn3(X*.4,Y*.4,1)-.5)*2.2,Yw=Y+(vn3(X*.5+3,Y*.45,2)-.5)*1.6;
  var by=Yw*1.15+1.3*vn3(0,Yw*.33,5),row=Math.floor(by),fy=by-row;
  var wd=.7+.9*n3(row,1.1,2.2),bx=Xw/wd+row*.43+1.1*n3(row,7,7),col=Math.floor(bx),fx=bx-col;
  var h=n3(col*1.7,row*2.3,3.3),h2=n3(col*3.1,row*1.3,9.7);
  var e=Math.min(fx*wd,(1-fx)*wd,fy*.9,(1-fy)*.9),open_=sm(.25,.6,vn3(X*.7,Y*.6,6));
  var groove=(1-sm(0,.07,e))*(.35+.65*open_)*(.4+.6*h2),bev=sm(0,.16,e);
  return{h:h,h2:h2,groove:groove,bev:bev,row:row}}
/* three overlapping rock masses (main massif + two spurs) with ridged skylines, leaning faces and scree aprons */
var WZ=-4.5;
var WALLS=[
 {z0:-8.6+WZ,x0:-9.5,x1:6.5,lean:.2,sd:0,res:[250,150],lip:true,
  top:function(x){var e=1-.62*sm(.4,3.2,x),h=(4.5+3.0*ridge(x*.3+1,1)+1.1*ridge(x*.95+2,2)+.4*vn3(x*3+5,1,1))*e+1.5*(1-e);var m=5.9;if(h>m)h=m+.5*Math.tanh((h-m)/.5);return h}},
 {z0:-6.0+WZ,x0:-9.5,x1:-1.8,lean:.24,sd:31,res:[140,90],lip:false,
  top:function(x){var e=1-sm(-4.4,-1.8,x);return(2.6+2.6*ridge(x*.45+7,3)+.8*ridge(x*1.3,4)+.3*vn3(x*4,2,2))*e}},
 {z0:-6.9+WZ,x0:-.6,x1:6.5,lean:.2,sd:57,res:[150,80],lip:false,
  top:function(x){var e=sm(-.6,1.4,x)*(1-.3*sm(3,6,x));return(1.5+1.5*ridge(x*.5+9,5)+.5*ridge(x*1.6,6)+.2*vn3(x*5,3,3))*e}}];
function wallZ(o,X,Y){
  var Xs=X+o.sd,n=vn3(Xs*.55+9,Y*.5,2)*.55+vn3(Xs*1.3,Y*1.1+4,5)*.3+vn3(Xs*3,Y*2.6,7)*.15,rid=1-Math.abs(vn3(Xs*.8,Y*.35+2,3)*2-1);
  var b=blk(Xs,Y),crev=Math.pow(1-Math.abs(vn3(Xs*2.0+1,Y*.1,4)*2-1),8),big=vn3(Xs*.32+4,Y*.3,8),top=o.top(X);
  var d=n*1.0+rid*.45+big*.6-crev*.5+(b.h-.5)*.42*(.4+b.h2)+b.bev*.12-b.groove*.26+vn3(Xs*7,Y*7,1)*.07+vn3(Xs*17,Y*17,4)*.025;
  var ribs=(vn3(Xs*1.1+5,Y*.05,3)-.5)*2.4+(vn3(Xs*2.6,Y*.08,6)-.5)*.8;
  var talus=1.5*(1-sm(0,2.0,Y))*(.6+.4*vn3(Xs*1.2,Y,2));
  var z=o.z0+d+ribs+talus-o.lean*Y-1.3*sm(top-1.6,top,Y)*(.6+.4*vn3(Xs*2,3,3));
  if(o.lip){var dx=Math.abs(X-FXc-.12)+.5*(vn3(X*2.3,Y*1.6,1)-.5),env=1-sm(1.0,1.6,dx),sh=.8*sm(LIPY-1.7,LIPY-.9,Y+.12*vn3(X*3,2,2))*(1-sm(LIPY-.03,LIPY+.1,Y))*env;z+=sh}
  return z}
function frontZ(x,y){var z=-99;WALLS.forEach(function(o){if(x>o.x0+.3&&x<o.x1-.3&&o.top(x)>y+.2)z=Math.max(z,wallZ(o,x,y))});return z}
WALLS.forEach(function(o){
  var W_=o.x1-o.x0,g=new THREE.PlaneGeometry(W_,1,o.res[0],o.res[1]),p=g.attributes.position,col=new Float32Array(p.count*3);
  for(var i=0;i<p.count;i++){var X=o.x0+(p.getX(i)+W_/2),v=p.getY(i)+.5,Y=-.2+v*(Math.max(.05,o.top(X))+.2);p.setXYZ(i,X,Y,wallZ(o,X,Y));
    var b=blk(X+o.sd,Y),rw=.8+.4*n3(b.row,2.2,1.1),stain=sm(.55,.85,vn3((X+o.sd)*7,Y*.35,5)),t=(.66+.5*b.h2-.1*b.h)*rw*(1-.3*stain),ao=1-b.groove*.7,tint=[1,.95-.1*b.h-.05*rw,.88-.18*b.h];
    col[i*3]=t*ao*tint[0];col[i*3+1]=t*ao*tint[1];col[i*3+2]=t*ao*tint[2]}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();
  var m=new THREE.Mesh(g,rockMat);m.castShadow=m.receiveShadow=true;scene.add(m)});
var LIPZ=wallZ(WALLS[0],FXc,LIPY-.6);POOL.z=LIPZ+.34;
/* boulders */
(function(){var br=rng(77);
  function add(x,z,s,seed,fl){var m=new THREE.Mesh(polyRock(seed,s*(1+br()*.4),s*(fl||.62),s*(1+br()*.4)),rockMat);m.position.set(x,s*.3,z);m.rotation.y=br()*6.28;m.castShadow=m.receiveShadow=true;scene.add(m)}
  var seed=1;
  for(var x=-8;x<3.5;x+=.95){var z=frontZ(x,.3)+.1+br()*.5;add(x,z,.4+br()*.45+(x<-3?.25:0),seed++)}
  [[-2.9,-4.2,.7],[-2.4,-3.0,.42],[-3.6,-3.2,.75],[-.2,-4.9,.45],[.9,-3.9,.4],[1.4,-5.4,.5],[-.6,-5.0,.35],[2.6,-3.2,.3],[3.0,-6,.5],[-4.4,-2.0,.6],[-1.8,-.9,.26],[.9,-.8,.2],[2.2,.2,.18],[-3.0,.8,.22],[3.0,-.6,.24]].forEach(function(b){add(b[0],b[1]<-1.5?b[1]+WZ:b[1],b[2],seed++,.55)})
  var pm=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0x8a7c68,roughness:.95}),70),d=new THREE.Object3D();
  for(var i=0;i<70;i++){var s2=.03+br()*.08;d.position.set((br()-.5)*9,s2*.3,2.5-br()*9);d.rotation.set(br()*3,br()*3,br()*3);d.scale.set(s2*(1+br()*.6),s2*.6,s2);d.updateMatrix();pm.setMatrixAt(i,d.matrix);pm.setColorAt(i,new THREE.Color().setHSL(.08,.15,.3+br()*.25))}
  pm.castShadow=pm.receiveShadow=true;scene.add(pm)})();

yield;
/* ---------- water ---------- */
var waterMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
 uniforms:{uT:U.uT,uPool:U.uPool,uR:U.uR,uFlow:U.uFlow,uP:U.uP,uSun:U.uSun,uHor:skyU.uHor,uZen:skyU.uZen,uHW:{value:.3}},
 vertexShader:'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
 fragmentShader:NOISE+'\nuniform float uT,uR,uFlow,uP,uHW;uniform vec3 uPool,uSun,uHor,uZen;varying vec3 vW;\n'+
 'void main(){vec2 rel=vW.xz-uPool.xz;float ang=atan(rel.y,rel.x);float dd=length(rel);'+
 'float R=uR*(1.+.4*cos(ang-.8)+.12*sin(3.*ang+1.)+.07*sin(5.*ang+2.));R*=1.+.06*vn(rel*1.3);if(dd>R+.05)discard;'+
 'float mask=smoothstep(R,R-.22,dd);float depth=clamp((R-dd)/max(R,.2)*2.2,0.,1.);'+
 'vec2 p=vW.xz;float t=uT;vec2 g=vec2(0.);'+
 'g+=vec2(.9,.4)*.05*cos(dot(p,vec2(.9,.4))*3.1+t*.6);g+=vec2(-.5,.8)*.05*cos(dot(p,vec2(-.5,.8))*4.3+t*.8);g+=vec2(.3,-.9)*.02*cos(dot(p,vec2(.3,-.9))*7.1+t*1.1);'+
 'vec2 im=p-uPool.xz;float ir=length(im);float rg=cos(ir*9.-t*2.4)*exp(-ir*.7)*(.25+.75*uFlow);g+=normalize(im+1e-4)*rg*.2;'+
 'vec3 N=normalize(vec3(-g.x,1.,-g.y));vec3 V=normalize(cameraPosition-vW);vec3 Rr=reflect(-V,N);'+
 'vec3 sk=mix(uHor,uZen,pow(clamp(Rr.y,0.,1.),.45));vec3 rock=vec3(.09,.075,.06);'+
 'vec3 refl=mix(rock,sk,smoothstep(.03,.3,Rr.y+.1*fbm(p*.7)));'+
 'float sd=max(dot(Rr,uSun),0.);float spec=pow(sd,420.)*6.+pow(sd,40.)*.25;'+
 'float fr=.04+.96*pow(1.-max(dot(N,V),0.),5.);'+
 'float clear=smoothstep(.1,.7,uP);vec3 deep=mix(vec3(.05,.04,.03),vec3(.006,.07,.1),clear);vec3 shal=mix(vec3(.13,.1,.07),vec3(.03,.19,.2),clear);'+
 'vec3 base=mix(shal,deep,depth);vec3 col=mix(base,refl*.7,clamp(.1+.55*fr,0.,.62))+vec3(1.,.9,.72)*spec;'+
 'float foamR=.55+uHW*2.4;float fm=smoothstep(.42,.72,fbm(p*6.+vec2(0.,t*.5)))*smoothstep(foamR*1.7,.1,ir)*(.4+.6*uFlow);'+
 'fm+=smoothstep(.12,0.,abs(ir-(.7+mod(t*.5,2.))*foamR))*.35*uFlow*smoothstep(foamR*3.,.5,ir);'+
 'float sh=smoothstep(.26,.0,R-dd)*(.45+.55*fbm(p*7.));'+
 'col=mix(col,vec3(.94,.97,.98),clamp(fm+sh*.75,0.,1.));'+
 'float alpha=mask*mix(.82,.98,depth);alpha=max(alpha,clamp(fm+sh,0.,1.)*mask);gl_FragColor=vec4(col,alpha);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'});
var water=new THREE.Mesh(new THREE.PlaneGeometry(26,26),waterMat);water.rotation.x=-Math.PI/2;water.position.set(POOL.x+2.8,.03,POOL.z+2.6);water.renderOrder=2;scene.add(water);

/* waterfall: dense jet at the lip, aerated white water lower down, spray and rivulets on the rock */
var FX=POOL.x,FZ0=LIPZ+.04,FTOP=LIPY-.05,FZ=FZ0+.3;
var FALL_FS=NOISE+'\nuniform float uT,uFlow,uHW,uH,uAmt,uSd,uWid;varying vec2 vU;void main(){'+
 'float xm=(vU.x-.5)*uWid,ym=(1.-vU.y)*uH;float f=ym/uH;'+
 'float hw=uHW*(.8+.3*f)*(1.+.12*(vn(vec2(ym*1.4,uSd))-.5));float ex=abs(xm)-hw;'+
 'float edge=1.-smoothstep(-.06,.05+.08*f,ex);'+
 'float s=vn(vec2(xm*7.+uSd,ym*.9-uT*1.9))*.5+vn(vec2(xm*19.+uSd,ym*1.5-uT*2.6))*.32+vn(vec2(xm*46.,ym*2.8-uT*3.4))*.18;'+
 'float aer=smoothstep(.0,.85,f);'+
 'float body=mix(1.,.78,aer)*(.78+.34*s);body*=mix(1.,smoothstep(.15,.5,s),aer*.6);'+
 'float lip=smoothstep(0.,.05,ym);float a=edge*body*lip*uAmt;'+
 'float spray=smoothstep(.04,.0,ex)*0.;a+=smoothstep(.15,.0,ex)*(1.-edge)*.15*aer*uAmt*smoothstep(.45,.75,s);'+
 'vec3 clearc=vec3(.55,.72,.74),white=vec3(1.,1.,1.);vec3 c=mix(clearc,white,clamp(aer*1.5+s*.7+.1,0.,1.));c*=1.+.25*smoothstep(.5,.9,s);'+
 'c*=.88+.2*vn(vec2(xm*3.,ym*.5-uT*.6));'+
 'gl_FragColor=vec4(c,clamp(a,0.,.95));\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}';
function mkFall(wid,h,sd){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
 uniforms:{uT:U.uT,uFlow:U.uFlow,uHW:{value:.3},uH:{value:h},uAmt:{value:1},uSd:{value:sd},uWid:{value:wid}},
 vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:FALL_FS})}
var fallMat=mkFall(1.9,FTOP,3.1);
var falls=[(function(){var g=new THREE.PlaneGeometry(1.9,FTOP,1,32),p=g.attributes.position;for(var i=0;i<p.count;i++){var ty=(p.getY(i)+FTOP/2)/FTOP;p.setZ(i,.3*Math.sqrt(Math.max(0,1-ty)))}
 var m=new THREE.Mesh(g,fallMat);m.position.set(FX,FTOP/2+.03,FZ0);m.renderOrder=3;scene.add(m);return m})()];
/* particles: mist + dust */
function softTex(){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
var ST=softTex();
function pts(n,size,op,color){var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));
  var m=new THREE.Points(g,new THREE.PointsMaterial({map:ST,size:size,transparent:true,opacity:op,depthWrite:false,color:color,sizeAttenuation:true,fog:false}));m.frustumCulled=false;m.renderOrder=4;scene.add(m);return m}
var NM=60,ND2=170,NS=120,mist=pts(NM,1.7,.13,0xe8f0f3),drops=pts(ND2,.075,.6,0xffffff),splash=pts(NS,.1,.65,0xffffff),pr_=rng(9);
var mistS=[],dropS=[],splS=[];for(var i=0;i<NM;i++)mistS.push({a:pr_(),x:pr_()-.5,z:pr_()-.5});for(i=0;i<ND2;i++)dropS.push({t:pr_(),o:pr_()*2-1,v:.6+pr_()*.5});
for(i=0;i<NS;i++)splS.push({t:pr_()*2,vx:0,vy:0,vz:0,x:0,z:0,live:false});
var ND=220,dustGeo=new THREE.BufferGeometry(),dustP=new Float32Array(ND*3),dr=rng(21);for(var i=0;i<ND;i++){dustP[i*3]=(dr()-.5)*14;dustP[i*3+1]=dr()*6;dustP[i*3+2]=-dr()*14+3}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustP,3));
var dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({map:ST,size:.09,transparent:true,opacity:.5,depthWrite:false,color:0xffe2b0,sizeAttenuation:true,fog:false}));dust.frustumCulled=false;scene.add(dust);

yield;
/* ---------- grass & flowers ---------- */
var GROW_V=['attribute float iT;uniform float uP,uT;','float gk=smoothstep(iT,iT+.14,uP);vec3 transformed=vec3(position);transformed.y*=gk;transformed.x*=mix(.15,1.,gk);transformed.z*=gk;'+
 'float swp=sin(uT*1.5+instanceMatrix[3].x*1.7+instanceMatrix[3].z*1.3)+.5*sin(uT*2.7+instanceMatrix[3].x*3.1);transformed.x+=swp*.07*position.y*position.y;'];
function poolRad(ang){return 4.6*(1+.4*Math.cos(ang-.8)+.12*Math.sin(3*ang+1)+.07*Math.sin(5*ang+2))}
var grassGeo=(function(){var g=new THREE.BufferGeometry(),v=[-.03,0,0,.03,0,0,-.02,.5,0,.02,.5,0,0,1,.05],
 c=[.05,.09,.025, .05,.09,.025, .16,.3,.08, .16,.3,.08, .42,.56,.2],ix=[0,1,2,1,3,2,2,3,4];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.setIndex(ix);g.computeVertexNormals();return g})();
function growMat(){var m=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});patch(m,{key:'grassL',vdecl:GROW_V[0],vbody:GROW_V[1]});return m}
var NG=42000,grassMesh=new THREE.InstancedMesh(grassGeo,growMat(),NG),gT=new Float32Array(NG);
(function(){var r=rng(5),d=new THREE.Object3D(),n=0,col=new THREE.Color(),PER=16;
 while(n<NG){var cx=(r()*2-1)*13,cz=-13+r()*18,dx=cx-POOL.x,dz=cz-POOL.z,dist=Math.sqrt(dx*dx+dz*dz);
  if(dist<poolRad(Math.atan2(dz,dx))*1.05)continue;if(cz<-12.5&&cx<4.5)continue;
  var cr=.25+r()*.5,ch=.14+r()*.26,hue=.17+r()*.12,lig=.62+r()*.4,ct=.2+(dist/22)*.55+r()*.12;
  for(var k=0;k<PER&&n<NG;k++){var a=r()*6.283,rr=Math.abs(r()+r()-1)*cr*1.6,x=cx+Math.cos(a)*rr,z=cz+Math.sin(a)*rr;
   var h=ch*(.65+.7*r())*(1-.4*rr/(cr*1.6));d.position.set(x,0,z);d.rotation.set((r()-.5)*.35,r()*6.283,(r()-.5)*.35);d.scale.set(1.1+r()*1.0,h,1);d.updateMatrix();grassMesh.setMatrixAt(n,d.matrix);
   col.setHSL(hue+(r()-.5)*.03,.38+r()*.25,lig*(.8+r()*.4));grassMesh.setColorAt(n,col);gT[n]=cl(ct+r()*.06,0,.96);n++}}
 grassMesh.geometry.setAttribute('iT',new THREE.InstancedBufferAttribute(gT,1));grassMesh.frustumCulled=false;QI.push([grassMesh,NG]);scene.add(grassMesh)})();
/* reeds along the shore */
(function(){var NR=1200,rm_=new THREE.InstancedMesh(grassGeo.clone(),growMat(),NR),th=new Float32Array(NR),r=rng(31),d=new THREE.Object3D(),col=new THREE.Color();
 for(var i=0;i<NR;i++){var a=r()*6.283;if(Math.sin(a)>.15){a=-a}var rd=poolRad(a)*(1.03+r()*.3),x=POOL.x+Math.cos(a)*rd,z=POOL.z+Math.sin(a)*rd;
  d.position.set(x,0,z);d.rotation.set((r()-.5)*.25,r()*6.283,(r()-.5)*.25);d.scale.set(.8+r()*.6,.28+r()*.4,1);d.updateMatrix();rm_.setMatrixAt(i,d.matrix);
  col.setHSL(.2+r()*.06,.4+r()*.2,.55+r()*.3);rm_.setColorAt(i,col);th[i]=.3+r()*.2}
 rm_.geometry.setAttribute('iT',new THREE.InstancedBufferAttribute(th,1));rm_.frustumCulled=false;scene.add(rm_)})();
/* stones around the pool edge and scattered scree */
(function(){var r=rng(41),vs=[];for(var i=0;i<6;i++)vs.push(polyRock(200+i,1,.6+r()*.3,1));
 for(i=0;i<70;i++){var a=r()*6.283;if(Math.sin(a)>.25&&i<44)a=-a;var near=i<44,rd=near?poolRad(a)*(.94+r()*.3):poolRad(a)*(1.3+r()*2.2),sz=near?.1+r()*.42:.08+r()*.22;
  var m=new THREE.Mesh(vs[i%6],rockMat);m.scale.setScalar(sz);m.position.set(POOL.x+Math.cos(a)*rd,sz*.22,POOL.z+Math.sin(a)*rd);m.rotation.set(r()*.5,r()*6.28,r()*.5);m.receiveShadow=true;scene.add(m)}})();
(function(){
 var flowerGeo=(function(){var st=new THREE.CylinderGeometry(.008,.012,.4,4);st.translate(0,.2,0);var hd=new THREE.SphereGeometry(.05,8,6);hd.scale(1,.55,1);hd.translate(0,.42,0);
  function paint(g,c){var a=new Float32Array(g.attributes.position.count*3);for(var i=0;i<a.length;i+=3){a[i]=c[0];a[i+1]=c[1];a[i+2]=c[2]}g.setAttribute('color',new THREE.BufferAttribute(a,3))}
  paint(st,[.1,.25,.05]);paint(hd,[1,1,1]);
  var P=[],C=[],I=[],off=0;[st,hd].forEach(function(g){var p=g.attributes.position.array,c=g.attributes.color.array;for(var i=0;i<p.length;i++){P.push(p[i]);C.push(c[i])}g.index.array.forEach(function(k){I.push(k+off)});off+=g.attributes.position.count});
  var m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('color',new THREE.Float32BufferAttribute(C,3));m.setIndex(I);m.computeVertexNormals();return m})();
 var r=rng(66),cols=[[1,.96,.78],[.98,.98,.96],[.8,.66,.9],[.95,.74,.25]];
 for(var k=0;k<4;k++){var N=110,g=flowerGeo.clone(),m=new THREE.InstancedMesh(g,growMat(),N),th=new Float32Array(N),d=new THREE.Object3D();
  for(var i=0;i<N;i++){var ok=false,x,z,dist;while(!ok){x=(r()*2-1)*11;z=-12+r()*15;var ddx=x-POOL.x,ddz=z-POOL.z;ok=Math.sqrt(ddx*ddx+ddz*ddz)>poolRad(Math.atan2(ddz,ddx))*1.1&&!(z<-11.5&&x<4.5)}
   d.position.set(x,0,z);d.rotation.set((r()-.5)*.25,r()*6,(r()-.5)*.25);var s=.7+r()*.7;d.scale.set(s,s,s);d.updateMatrix();m.setMatrixAt(i,d.matrix);m.setColorAt(i,new THREE.Color(cols[k][0],cols[k][1],cols[k][2]).multiplyScalar(.9+r()*.1));th[i]=.72+r()*.25}
  g.setAttribute('iT',new THREE.InstancedBufferAttribute(th,1));m.frustumCulled=false;scene.add(m);
  /* stems share colors: tint via instance color is multiplied; keep stems greenish by painting head only through instanceColor weight */
 }})();

yield;
/* ---------- trees ---------- */
function barkTex(){var c=document.createElement('canvas');c.width=128;c.height=256;var x=c.getContext('2d'),r=rng(3);x.fillStyle='#5b4632';x.fillRect(0,0,128,256);
 for(var i=0;i<260;i++){var px=r()*128,w=1+r()*3,l=30+r()*120,py=r()*256,a=.12+r()*.3;x.fillStyle='rgba('+(r()<.5?'20,14,9,':'120,100,76,')+a+')';x.fillRect(px,py,w,l);x.fillRect(px+128>128?px-128:px,py-256,w,l)}
 var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return t}
function leafTex(){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),r=rng(8);
 for(var i=0;i<9;i++){var a=-Math.PI/2+(i-4)*.46+(r()-.5)*.2,L=62+r()*28,W=18+r()*8,cx=128+Math.cos(a+Math.PI/2)*0,cy=214;
  x.save();x.translate(cx,cy);x.rotate(a+Math.PI/2);x.translate(0,-10);
  var g=x.createLinearGradient(0,0,0,-L);g.addColorStop(0,'#2f5b1c');g.addColorStop(1,'#7fae3a');x.fillStyle=g;
  x.beginPath();x.moveTo(0,0);x.bezierCurveTo(W,-L*.25,W*.9,-L*.7,0,-L);x.bezierCurveTo(-W*.9,-L*.7,-W,-L*.25,0,0);x.fill();
  x.strokeStyle='rgba(20,50,10,.55)';x.lineWidth=1.4;x.beginPath();x.moveTo(0,0);x.lineTo(0,-L*.92);x.stroke();x.restore()}
 for(var j=0;j<7;j++){var a2=(r()-.5)*2.2,L2=44+r()*26;x.save();x.translate(128,170);x.rotate(a2);var g2=x.createLinearGradient(0,0,0,-L2);g2.addColorStop(0,'#3d6a22');g2.addColorStop(1,'#98c24a');x.fillStyle=g2;x.beginPath();x.moveTo(0,0);x.bezierCurveTo(14,-L2*.25,12,-L2*.7,0,-L2);x.bezierCurveTo(-12,-L2*.7,-14,-L2*.25,0,0);x.fill();x.restore()}
 var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t}
var BT=barkTex(),LT=leafTex();
var V3=THREE.Vector3;
function buildTree(seed){
  var R=rng(seed),P=[],Nn=[],UV=[],AT=[],AB=[],AC=[],IDX=[],leaves=[],maxL=0,SEG=7;
  function rr(a,b){return a+R()*(b-a)}
  function ring(c,dir,rad,pl,pc){var up=Math.abs(dir.y)>.92?new V3(1,0,0):new V3(0,1,0),a=new V3().crossVectors(dir,up).normalize(),b=new V3().crossVectors(dir,a),s=P.length/3;
    for(var j=0;j<=SEG;j++){var an=j/SEG*6.2832,x=Math.cos(an),y=Math.sin(an),nx=a.x*x+b.x*y,ny=a.y*x+b.y*y,nz=a.z*x+b.z*y;
      P.push(c.x+nx*rad,c.y+ny*rad,c.z+nz*rad);Nn.push(nx,ny,nz);UV.push(j/SEG*2,pl*.45);AT.push(pl);AB.push(pc.x,pc.y,pc.z);AC.push(c.x,c.y,c.z)}return s}
  function link(s0,s1){for(var j=0;j<SEG;j++){var a=s0+j,b=s0+j+1,c=s1+j,d=s1+j+1;IDX.push(a,c,b,b,c,d)}}
  var CFG=[{len:2.4,r:.26,n:7,ch:5,cl:[.62,.78]},{len:1.9,r:.11,n:5,ch:3,cl:[.6,.78]},{len:1.35,r:.04,n:4,ch:3,cl:[.6,.8]},{len:.95,r:.02,n:3,ch:2,cl:[.6,.8]},{len:.65,r:.01,n:3,ch:0,cl:[1,1]}];
  function branch(o,dir,len,r0,depth,pl0,pc0){
    var cf=CFG[depth],n=cf.n,seg=len/n,c=o.clone(),d=dir.clone(),pl=pl0,rEnd=r0*(depth<1?.5:.6);
    var rings=[],last=ring(c,d,r0,pl,pc0);rings.push({c:c.clone(),d:d.clone(),pl:pl});
    for(var i=1;i<=n;i++){
      d.add(new V3(rr(-.2,.2),rr(-.03,.16)*(depth>0?1:.35),rr(-.2,.2)).multiplyScalar(depth<1?.55:1));if(depth>=2)d.y-=.045;d.normalize();
      c=c.clone().addScaledVector(d,seg);pl+=seg;var s=ring(c,d,lerp(r0,rEnd,i/n),pl,rings[i-1].c);link(last,s);last=s;rings.push({c:c.clone(),d:d.clone(),pl:pl});
      if(depth>=2){var nl=2;for(var q=0;q<nl;q++)leaves.push({p:c.clone().add(new V3(rr(-.14,.14),rr(-.1,.14),rr(-.14,.14))),t:pl,lt:rr(.1,.78),s:rr(.55,.95)})}}
    maxL=Math.max(maxL,pl);
    if(depth<4&&cf.ch>0){var m=cf.ch,gold=R()*6.28;for(var k=0;k<m;k++){
      var f=lerp(depth===0?.45:.4,1,(k+.5)/m),idx=Math.min(rings.length-1,Math.max(1,Math.round(f*(rings.length-1)))),rg=rings[idx];
      var up=Math.abs(rg.d.y)>.92?new V3(1,0,0):new V3(0,1,0),a=new V3().crossVectors(rg.d,up).normalize(),b=new V3().crossVectors(rg.d,a);
      var ph=gold+k*2.399+rr(-.4,.4),th=(depth===0?.75:.62)+rr(-.15,.35);
      var nd=rg.d.clone().multiplyScalar(Math.cos(th)).addScaledVector(a,Math.cos(ph)*Math.sin(th)).addScaledVector(b,Math.sin(ph)*Math.sin(th));nd.y+=depth<2?.35:.12;nd.normalize();
      var nl=len*rr(cf.cl[0],cf.cl[1]);if(depth===0)nl=CFG[1].len*rr(.8,1.15)*(1.12-f*.55);
      branch(rg.c,nd,Math.max(nl,.35),CFG[depth+1].r*(depth===0?1:rr(.85,1.1)),depth+1,rg.pl,rg.c)}}
    if(depth===0){/* crown leader */var top=rings[rings.length-1];branch(top.c,new V3(rr(-.15,.15),1,rr(-.15,.15)).normalize(),1.6,CFG[1].r*.8,1,top.pl,top.c)}
  }
  branch(new V3(0,0,0),new V3(0,1,0),CFG[0].len,CFG[0].r,0,0,new V3(0,0,0));
  for(var i=0;i<AT.length;i++)AT[i]/=maxL;leaves.forEach(function(l){l.t/=maxL});
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));
  g.setAttribute('aT',new THREE.Float32BufferAttribute(AT,1));g.setAttribute('aBase',new THREE.Float32BufferAttribute(AB,3));g.setAttribute('aC',new THREE.Float32BufferAttribute(AC,3));g.setIndex(IDX);
  return{geo:g,leaves:leaves};
}
var TRUNK_V=['attribute float aT;attribute vec3 aBase;attribute vec3 aC;uniform float uG;','float tk=smoothstep(aT,aT+.1,uG);float rs=mix(.5,1.,uG);vec3 transformed=mix(aBase,aC+(position-aC)*rs,tk);'];
var LEAF_V=['attribute float iT;attribute float iL;uniform float uG,uL,uT;','float lk=smoothstep(iT+.08,iT+.22,uG)*smoothstep(iL,iL+.2,uL);vec3 transformed=position*lk;float lw=uT*1.7+iL*40.+instanceMatrix[3].x*2.;transformed.x+=sin(lw)*.04*lk;transformed.y+=cos(lw*1.3)*.03*lk;'];
function trunkMat(){var m=new THREE.MeshStandardMaterial({map:BT,bumpMap:BT,bumpScale:2.2,roughness:1,color:0xf0e0c8});patch(m,{key:'trunk',vdecl:TRUNK_V[0],vbody:TRUNK_V[1]});return m}
function trunkDepth(){var m=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});patch(m,{key:'trunkD',vdecl:TRUNK_V[0],vbody:TRUNK_V[1]});return m}
var leafMat=new THREE.MeshLambertMaterial({map:LT,alphaTest:.45,side:THREE.DoubleSide,emissive:0x1b3d0c,emissiveIntensity:.55});patch(leafMat,{key:'leafL',vdecl:LEAF_V[0],vbody:LEAF_V[1]});
var leafDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:LT,alphaTest:.45});patch(leafDepth,{key:'leafD',vdecl:LEAF_V[0],vbody:LEAF_V[1]});
var leafQuad=new THREE.PlaneGeometry(.55,.55);leafQuad.translate(0,.2,0);
var treeGroups=[];
var TC={};
function makeTree(seed,pos,sc,ry,aa){
  var T=TC[seed]||(TC[seed]=buildTree(seed)),grp=new THREE.Group(),trunk=new THREE.Mesh(T.geo,trunkMat());trunk.customDepthMaterial=trunkDepth();trunk.castShadow=true;trunk.receiveShadow=true;trunk.frustumCulled=false;grp.add(trunk);
  var g=leafQuad.clone(),N=T.leaves.length,iT=new Float32Array(N),iL=new Float32Array(N);
  var lm=new THREE.InstancedMesh(g,leafMat,N),d=new THREE.Object3D(),r=rng(seed+3+Math.floor(pos.x*7)),col=new THREE.Color();
  T.leaves.forEach(function(l,i){d.position.copy(l.p);d.rotation.set(r()*6.28,r()*6.28,r()*6.28);d.scale.setScalar(l.s*1.5);d.updateMatrix();lm.setMatrixAt(i,d.matrix);
    col.setHSL(.22+r()*.07,.5+r()*.2,.5+r()*.28);lm.setColorAt(i,col);iT[i]=l.t;iL[i]=l.lt});
  g.setAttribute('iT',new THREE.InstancedBufferAttribute(iT,1));g.setAttribute('iL',new THREE.InstancedBufferAttribute(iL,1));
  lm.customDepthMaterial=leafDepth;lm.castShadow=true;lm.receiveShadow=true;lm.frustumCulled=false;grp.add(lm);
  var dd=Math.sqrt(Math.pow(pos.x-POOL.x,2)+Math.pow(pos.z-POOL.z,2));
  grp.position.copy(pos);grp.rotation.y=ry;grp.userData.s=sc;grp.userData.sx=.9+((Math.floor(pos.x*13)%7)/7)*.25;grp.userData.sz=.9+((Math.floor(pos.z*11)%7)/7)*.25;grp.userData.a=aa!=null?aa:.12+Math.min(.5,dd/26);scene.add(grp);treeGroups.push(grp);return grp}
[[51,-4.2,-3.2,0.62,0.0],[67,-6.4,-2.2,0.55,1.7],[83,-8.6,-4.5,0.7,3.4],[23,-10.0,-2.0,0.6,5.1],[37,-5.6,-5.6,0.66,0.6],[11,-7.6,-6.8,0.78,2.3],[51,1.6,-4.6,0.5,4.0],[67,3.0,-5.4,0.6,5.7],[83,4.8,-3.6,0.6,1.2],[23,6.4,-5.2,0.7,2.9],[37,8.2,-3.0,0.6,4.6],[11,9.6,-6.0,0.74,0.1],[51,5.6,-7.2,0.8,1.8],[67,2.4,-7.4,0.8,3.5],[83,7.4,-8.2,0.85,5.2],[23,-9.4,-8.0,0.85,0.7],[37,-3.2,-7.6,0.8,2.4],[11,0.9,-6.2,0.62,4.1],[51,10.8,-3.8,0.6,5.8],[67,-11.2,-4.6,0.7,1.3]].forEach(function(t){makeTree(t[0],new V3(t[1],0,t[2]),t[3],t[4])});
/* a tree standing beside the camera: its leafy branches frame the upper-left corner */
makeTree(23,new V3(-3.4,0,-.4),.66,2.2,.1);

yield;
/* ---------- salovat: tog‘ ortidan nur bilan ko‘tarilgan xat ---------- */
var SX=.15,SY=10.0,SZ=-26,pulse=0,txtNow='',txtPend='';
var TC=document.createElement('canvas');TC.width=2048;TC.height=768;
var txtTex=new THREE.CanvasTexture(TC);txtTex.minFilter=THREE.LinearMipmapLinearFilter;txtTex.anisotropy=4;
var txtMesh=new THREE.Mesh(new THREE.PlaneGeometry(23,8.6),new THREE.MeshBasicMaterial({map:txtTex,transparent:true,depthWrite:false,fog:false,toneMapped:false,opacity:.3}));
txtMesh.position.set(SX,SY,SZ);txtMesh.renderOrder=1;scene.add(txtMesh);
var rayU={uT:{value:0},uI:{value:.2}};
var rays=new THREE.Mesh(new THREE.PlaneGeometry(90,60),new THREE.ShaderMaterial({uniforms:rayU,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,
 vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec2 vU;uniform float uT,uI;void main(){vec2 d=(vU-vec2(.5,.3))*vec2(1.5,1.);float r=length(d);float a=atan(d.y,d.x);float ray=0.;'+
  'ray+=pow(.5+.5*sin(a*11.+uT*.05+sin(a*3.+uT*.07)*1.5),6.)*.65;ray+=pow(.5+.5*sin(a*23.-uT*.04+2.),7.)*.45;ray+=pow(.5+.5*sin(a*5.+uT*.03+4.),4.)*.25;'+
  'float fall=exp(-r*1.9)*smoothstep(.02,.3,r);float g=exp(-r*6.)*.45+exp(-r*1.8)*.12;vec3 col=vec3(1.,.72,.34)*(ray*fall*.55+g)*uI;gl_FragColor=vec4(col,1.);}'}));
rays.position.set(SX,SY-2,SZ-3);rays.renderOrder=0;scene.add(rays);
var NMT=90,motP=new Float32Array(NMT*3),motS=[];(function(){var r=rng(77);for(var i=0;i<NMT;i++){motS.push({x:(r()*2-1)*10,y:r()*9-3,z:r()*4,s:.15+r()*.3,ph:r()*6.28})}})();
var motGeo=new THREE.BufferGeometry();motGeo.setAttribute('position',new THREE.BufferAttribute(motP,3));
var motes=new THREE.Points(motGeo,new THREE.PointsMaterial({map:softTex(),size:.16,transparent:true,opacity:0,depthWrite:false,color:0xffd88f,sizeAttenuation:true,fog:false,blending:THREE.AdditiveBlending}));
motes.frustumCulled=false;motes.renderOrder=2;scene.add(motes);
function drawTxt(ar){
  var x=TC.getContext('2d'),Wd=TC.width,Hd=TC.height,fam='"QPC Hafs","Noto Naskh Arabic","Amiri","Scheherazade New","Traditional Arabic",serif';
  x.clearRect(0,0,Wd,Hd);x.direction='rtl';x.textAlign='center';x.textBaseline='middle';
  var ws=ar.split(' ').filter(Boolean),fs=300,lines,mw=Wd-220;
  function meas(t){x.font=fs+'px '+fam;return x.measureText(t).width}
  while(true){
    lines=[ws.join(' ')];
    if(meas(lines[0])>mw&&ws.length>1&&fs<=120){var h=Math.ceil(ws.length/2);lines=[ws.slice(0,h).join(' '),ws.slice(h).join(' ')]}
    var okw=lines.every(function(t){return meas(t)<=mw}),okh=lines.length*fs*1.3<=Hd-90;
    if((okw&&okh)||fs<80)break;fs-=10}
  var lh=fs*1.3,y0=Hd/2-(lines.length-1)*lh/2;x.font=fs+'px '+fam;
  function pass(fn){lines.forEach(function(t,i){fn(t,Wd/2,y0+i*lh)})}
  x.save();x.shadowColor='rgba(8,14,32,.9)';x.shadowBlur=80;x.fillStyle='rgba(8,14,32,.85)';pass(function(t,a,b){x.fillText(t,a,b);x.fillText(t,a,b);x.fillText(t,a,b)});x.restore();
  x.save();x.shadowColor='rgba(255,190,90,.95)';x.shadowBlur=42;x.fillStyle='#ffd07a';pass(function(t,a,b){x.fillText(t,a,b)});x.restore();
  x.lineJoin='round';x.strokeStyle='#6e4308';x.lineWidth=Math.max(6,fs*.045);pass(function(t,a,b){x.strokeText(t,a,b)});
  var g=x.createLinearGradient(0,Hd/2-fs*.7,0,Hd/2+fs*.7);g.addColorStop(0,'#fffef6');g.addColorStop(.5,'#ffe9a8');g.addColorStop(1,'#f2b955');
  x.fillStyle=g;x.strokeStyle=g;x.lineWidth=Math.max(3,fs*.02);pass(function(t,a,b){x.fillText(t,a,b);x.strokeText(t,a,b)});
  txtTex.needsUpdate=true}
function setTxt(ar){ar=ar||'';if(ar===txtNow)return;txtNow=ar;
  var go=function(){drawTxt(ar)};
  try{if(document.fonts&&document.fonts.load){document.fonts.load('120px "QPC Hafs"',ar).then(go,go)}else go()}catch(e){go()}go()}
function skyFx(p,dt){
  pulse=Math.max(0,pulse-dt*2.6);
  var e=sm(0,1,p),k=.2+.8*Math.pow(e,.85),fl=.5+.5*Math.sin(T*.7);
  txtMesh.material.opacity=Math.min(1,.88+.12*sm(0,.3,p)+pulse*.2);
  var sc=1+.018*pulse;txtMesh.scale.set(sc,sc,1);txtMesh.position.y=SY+.12*Math.sin(T*.35);
  rayU.uT.value=T;rayU.uI.value=1.25*((.16+.84*k)*(.92+.08*fl)+pulse*.4);
  motes.material.opacity=.15+.75*e+pulse*.2;motes.material.size=.13+.07*e;
  for(var i=0;i<NMT;i++){var q=motS[i];q.y+=dt*q.s*(.6+e);if(q.y>7)q.y=-3;motP[i*3]=SX+q.x+Math.sin(T*.3+q.ph)*.4;motP[i*3+1]=SY-3+q.y;motP[i*3+2]=SZ+3+q.z}
  motGeo.attributes.position.needsUpdate=true}
yield;
/* ---------- sizing / camera ---------- */
var W=0,H=0,mx=0,my=0,tmx=0,tmy=0;
function resize(){var r=app.getBoundingClientRect();W=Math.max(280,r.width);H=Math.max(360,r.height);
  renderer.setPixelRatio(typeof pr==='number'?pr:1);renderer.setSize(W,H,false);camera.aspect=W/H;
  var off=Math.round(H*.07);camera.setViewOffset(W,H,0,off,W,H);camera.updateProjectionMatrix()}
var ro=new ResizeObserver(resize);ro.observe(app);resize();

/* ---------- per-frame state ---------- */
var C=THREE.Color,cA=new C(),cB=new C();
function mixc(out,a,b,t){return out.copy(a).lerp(b,t)}
var D={horA:new C(.62,.54,.42),horB:new C(.82,.78,.7),zenA:new C(.36,.34,.31),zenB:new C(.1,.3,.68),
  sunA:new C(1,.78,.5),sunB:new C(1,.84,.58),hemiSA:new C(.62,.6,.55),hemiSB:new C(.52,.7,.95),hemiGA:new C(.4,.34,.26),hemiGB:new C(.36,.38,.18),
  hillA:new C(.5,.46,.4),hillB:new C(.45,.55,.6),hill2A:new C(.55,.5,.43),hill2B:new C(.5,.6,.66),cDA:new C(.5,.47,.42),cDB:new C(.6,.64,.72),cLA:new C(.75,.68,.58),cLB:new C(1,.96,.9),leaf:new C(1,1,1),leafA:new C(.8,.82,.55)};
var T=0,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
function update(p,dt){
  skyFx(p,dt);
  T+=rm?0:dt;U.uT.value=T;U.uP.value=p;
  var e=sm(0,.85,p);
  U.uFlow.value=.1+.9*sm(0,.5,p);
  U.uR.value=.3+4.3*sm(.01,.62,p);waterMat.uniforms.uHW.value=.1+.5*sm(0,.85,p);
  U.uFront.value=.2+19*sm(.04,.6,p);
  U.uG.value=.1+.9*sm(.14,.95,p);U.uL.value=sm(.36,.98,p);
  mixc(skyU.uHor.value,D.horA,D.horB,e);mixc(skyU.uZen.value,D.zenA,D.zenB,e);mixc(skyU.uSunCol.value,D.sunA,D.sunB,e);
  skyU.uSunCol.value.multiplyScalar(.35+.65*e);skyU.uCloud.value=.5-.15*e;mixc(skyU.uCL.value,D.cLA,D.cLB,e);mixc(skyU.uCD.value,D.cDA,D.cDB,e);
  scene.fog.color.copy(skyU.uHor.value).lerp(new C(.7,.7,.7),.05);scene.fog.near=lerp(14,26,e);scene.fog.far=lerp(70,130,e);
  sun.color.copy(D.sunA).lerp(D.sunB,e);sun.intensity=lerp(1.4,3.4,e);
  mixc(hemi.color,D.hemiSA,D.hemiSB,e);mixc(hemi.groundColor,D.hemiGA,D.hemiGB,e);hemi.intensity=lerp(.7,1.0,e);fillL.intensity=lerp(.3,.6,e);
  hillU.uFog.value.copy(skyU.uHor.value).lerp(new C(.8,.8,.8),.15);hills[0].material.uniforms.uTop.value.copy(D.hillA).lerp(D.hillB,e);hills[1].material.uniforms.uTop.value.copy(D.hill2A).lerp(D.hill2B,e);hills[2].material.uniforms.uTop.value.copy(D.hill2A).lerp(D.hill2B,e).multiplyScalar(1.05);
  renderer.toneMappingExposure=lerp(.92,1.05,e);
  leafMat.color.copy(D.leafA).lerp(D.leaf,sm(.3,1,p));
  /* trees */
  treeGroups.forEach(function(g){var k=g.userData.s*(.24+.76*sm(g.userData.a,1,p));g.scale.set(k*g.userData.sx,k,k*g.userData.sz)});
  /* falls */
  var fl=U.uFlow.value,hw=.1+.5*sm(0,.85,p);fallMat.uniforms.uHW.value=hw;
  var i,q;
  var mp=mist.geometry.attributes.position.array;for(i=0;i<NM;i++){q=mistS[i];q.a=(q.a+dt*(.1+.06*fl))%1;mp[i*3]=FX+q.x*(1.2+hw*3)+Math.sin(T*.4+i)*.12;mp[i*3+1]=.15+q.a*1.9;mp[i*3+2]=FZ+.1+q.z*1.2+q.a*.7}
  mist.geometry.attributes.position.needsUpdate=true;mist.material.opacity=.03+.13*fl*(1-.25*Math.sin(T*.5));
  var dp=drops.geometry.attributes.position.array;for(i=0;i<ND2;i++){q=dropS[i];q.t+=dt*q.v*.55;if(q.t>1)q.t-=1;var tt=q.t,yy=FTOP*(1-tt*tt);
    if(i/ND2>fl){dp[i*3+1]=-9;continue}dp[i*3]=FX+q.o*(hw*1.3+.08*tt)+Math.sin(i*3.1+T)*.015;dp[i*3+1]=yy+.03;dp[i*3+2]=FZ0+.3*tt+.04}
  drops.geometry.attributes.position.needsUpdate=true;drops.material.opacity=.15+.5*fl;
  var sp=splash.geometry.attributes.position.array;for(i=0;i<NS;i++){q=splS[i];
    if(i/NS>fl){sp[i*3+1]=-9;continue}
    if(!q.live||q.t<0){var an=pr_()*6.283,sv=.35+pr_()*1.1;q.x=FX+(pr_()*2-1)*hw;q.z=FZ+(pr_()-.5)*.3;q.vx=Math.cos(an)*sv;q.vz=Math.sin(an)*sv*.7+.1;q.vy=1.2+pr_()*2.2;q.t=0;q.live=true}
    q.t+=dt;var y2=.06+q.vy*q.t-4.9*q.t*q.t;if(y2<.03&&q.t>.1){q.live=false;sp[i*3+1]=-9;continue}
    sp[i*3]=q.x+q.vx*q.t;sp[i*3+1]=y2;sp[i*3+2]=q.z+q.vz*q.t}
  splash.geometry.attributes.position.needsUpdate=true;splash.material.opacity=.2+.5*fl;
  /* dust */
  for(i=0;i<ND;i++){dustP[i*3+1]+=dt*.04*(1+(i%5)*.2);dustP[i*3]+=Math.sin(T*.3+i)*dt*.04;if(dustP[i*3+1]>6)dustP[i*3+1]=0}dustGeo.attributes.position.needsUpdate=true;dust.material.opacity=.55-.3*e;
  /* camera */
  mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;
  var z=lerp(7.4,6.4,e),by=0;
  if(false&&window.__camo){camera.position.set.apply(camera.position,false&&window.__camo[0]);camera.lookAt.apply(camera,false&&window.__camo[1])}else{camera.position.set(.3+mx*.45,2.1-my*.12,z);camera.lookAt(.15,1.9,-5.0)}
  sky.position.copy(camera.position);
}
var shP=-1,ema=34,pr=MOB?.9:1,fc=0,lastR=0,okRun=0,running=false,raf=0,visible=false;
function frame(now){if(!running)return;raf=requestAnimationFrame(frame);
  if(document.hidden||!app.offsetWidth)return;
  var el=now-lastR;if(el<28)return;lastR=now;
  var dt=Math.min(.1,el/1000);ema=ema*.9+Math.min(el,120)*.1;fc++;
  if(fc%30===0){var np=pr,cap=Math.min(window.devicePixelRatio||1,MOB?1.15:1.35);
    if(ema>41&&pr>.6){np=Math.max(.6,pr-.15);okRun=0}else if(ema>41&&QT<2){qSet(QT+1);okRun=0}else if(ema<35.5){okRun++;if(okRun>=4&&pr<cap){np=Math.min(cap,pr+.1);okRun=0}}else okRun=0;
    if(np!==pr){pr=np;resize()}}
  pd+=(tgt-pd)*(1-Math.exp(-dt*(rm?30:2.2)));if(Math.abs(tgt-pd)<.0003)pd=tgt;
  update(pd,dt);if(fc===5)cv.style.opacity='1';if(fc<4||(fc%8===0&&Math.abs(pd-shP)>.002)){renderer.shadowMap.needsUpdate=true;shP=pd}renderer.render(scene,camera)}
yield;
try{renderer.compile(scene,camera)}catch(e){}
yield;
update(0,.016);renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
if(MOB)qSet(1);
yield;
return{
 setHost:function(h){app=h;try{ro.disconnect();ro.observe(h)}catch(e){}resize()},
 run:function(on){if(on&&!running){running=true;lastR=0;resize();raf=requestAnimationFrame(frame)}else if(!on&&running){running=false;cancelAnimationFrame(raf)}},
 set:function(p,snap){tgt=cl(p,0,1);if(snap){pd=tgt;shP=-1}},
 resize:resize,
 setText:setTxt,
 pulse:function(){pulse=1},
 canvas:cv
}
}
var building=null;
window.BOG={ok:null,ready:false,mounted:false,
 build:function(h){
  if(building)return building;
  if(!window.THREE){return Promise.resolve(false)}
  var self=this;
  building=new Promise(function(res){
   var cv=document.createElement('canvas');cv.setAttribute('role','img');cv.setAttribute('aria-label','Sanoq oshgani sari quruq yer jonlanadi: suv, daraxt va yashillik');
   cv.style.cssText='display:block;width:100%;height:100%;opacity:0;transition:opacity 1s ease';
   h.appendChild(cv);var g;
   function fail(){try{cv.remove()}catch(e){}self.ok=false;building=null;res(false)}
   try{g=init(h,cv)}catch(e){fail();return}
   (function step(){var r;try{r=g.next()}catch(e){fail();return}
    if(!r.done){setTimeout(step,12);return}
    if(!r.value){fail();return}
    inst=r.value;self.ok=true;self.ready=true;self.fresh=true;res(true)})()
  });
  return building},
 mount:function(h){
  if(!inst)return false;
  if(inst.canvas.parentNode!==h){h.appendChild(inst.canvas);inst.setHost(h)}
  host=h;this.mounted=true;inst.run(true);return true},
 unmount:function(){this.mounted=false;if(inst)inst.run(false)},
 set:function(p){if(inst){inst.set(p,this.fresh);this.fresh=false}},
 setText:function(t){if(inst)inst.setText(t)},
 pulse:function(){if(inst)inst.pulse()}
};
})();
