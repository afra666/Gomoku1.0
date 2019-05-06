// JavaScript DocucolorIsBlacknt
"use strict";
var chess=document.getElementById("chess");
//context=画布
var context=chess.getContext("2d");
var colorIsBlack=true;
var bg=new Image();
bg.src="img/bg.png";


var gameOver=false;
//创建数组来存储棋盘某处是否有子
var existChess=[];
//改正
var solid=[];
//人方为黑色,先手
//pc为白色
var pcWin=[];
var manWin=[];
var layer=0;

for(var i=0;i<15;i++){
	existChess[i]=[];
	for(var j=0;j<15;j++){
		existChess[i][j]=0;
	}
}


bg.onload=function(){
	
	context.drawImage(bg,0,0,450,450);
	drawChessBoard();
	layerCalc();
};
var drawChessBoard=function(){
	//起点终点绘制
	for(var i=0;i<15;i++){
	//竖线,x变,y不变
	context.moveTo(15+i*30,15);
	context.lineTo(15+i*30,435);
	context.stroke();
	//横线,x不变 y变
	context.moveTo(15,15+i*30);
	context.lineTo(435,15+i*30);
	context.stroke();
	}

	//画5个圆点
	context.beginPath();
	context.arc(15+7*30,15+7*30,3,0,2*Math.PI);
	context.stroke();
	context.fill();
	context.beginPath();
	context.arc(15+3*30,15+3*30,3,0,2*Math.PI);
//	context.stroke();
	context.fill();
	context.beginPath();
	context.arc(15+11*30,15+3*30,3,0,2*Math.PI);
//	context.stroke();
	context.fill();
	context.beginPath();
	context.arc(15+3*30,15+11*30,3,0,2*Math.PI);
	context.stroke();
	context.fill();
	context.beginPath();
	context.arc(15+11*30,15+11*30,3,0,2*Math.PI);
//	context.stroke();
	context.fill();
};


chess.onclick=function(e){
	if (gameOver==true||colorIsBlack==false) {
		//如果游戏结束或者轮到计算机(白子),则return退出
		return;
	}
	
		var x=e.offsetX;
		var y=e.offsetY;
		
		var col=Math.floor(x/30);
		var line=Math.floor(y/30);
		
		if(existChess[line][col]===0){
		   oneStep(line,col,colorIsBlack);
		  //添加一子
		   existChess[line][col]=1;
			
			for (var k = 0; k < layer; k++) {
				if (solid[line][col][k]) {
					if (colorIsBlack) {
						manWin[k]++;
						pcWin[k]=6;//异常
					}
					
					if (manWin[k]==5) {
						window.alert("Yes, You win!");
						gameOver=true;
					}
					
				}
			}
		  }
		
		
		
		//开始AI算法
		if (!gameOver) {
			//取反,运行后轮到pc白方
			colorIsBlack=!colorIsBlack;
			
			pcAi();
		}
};

var pcAi=function(){
	//记录分数,二维数组的初始化
	var manScore=[];
	var pcScore=[];
	
	var max=0;
	//极值坐标
	var u=0,v=0;
	for (var i = 0; i < 15; i++) {
		manScore[i]=[];
		pcScore[i]=[];
		for (var j = 0; j < 15; j++) {
			manScore[i][j]=0;
			pcScore[i][j]=0;
			
		}
	}
	
	
	//对全体layer进行统计
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (existChess[i][j]==0) {
				//遍历所有层,累加有效层
				for (var k = 0; k < layer; k++) {
					//如果某层的这个点位为true
					if (solid[i][j][k]) {
						switch (manWin[k]) {
						case 1:
							manScore[i][j]+=200;
							break;
						case 2:
							manScore[i][j]+=400;
							break;
						case 3:
							manScore[i][j]+=2000;
							break;
						case 4:
							manScore[i][j]+=10000;
							break;

						default:
							break;
						}
						
						switch (pcWin[k]) {
						
						case 1:
							pcScore[i][j]+=220;
							break;
						case 2:
							pcScore[i][j]+=420;
							break;
						case 3:
							pcScore[i][j]+=2100;
							break;
						case 4:
							pcScore[i][j]+=20000;
							break;
						}
						
						if (manScore[i][j]>max) {
							max=manScore[i][j];
							u=i;v=j;
						}else if (manScore[i][j]==max) {
							//若该点分数更高,则再更换记录
							if (pcScore[i][j]>pcScore[u][v]) {
								u=i;v=j;
							}
						}
						
						if (pcScore[i][j]>max) {
							max=pcScore[i][j];
							u=i;v=j;
						}else if (pcScore[i][j]==max) {
							//若该点分数更高,则再更换记录
							if (manScore[i][j]>manScore[u][v]) {
								u=i;v=j;
							}
						}
						
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	existChess[u][v]=2;
	
	/**
	 * 以下对AI进行输赢判断
	 */
	//遍历赢法所有
	for (var k = 0; k < layer; k++) {
		//如果威震
		if (solid[u][v][k]) {
			pcWin[k]++;
			manWin[k]=6;
			if (pcWin[k]==5) {
				window.alert("Oops,你输了@@   AI win !");
				gameOver=true;
			}
		}
	}
	
	if (!gameOver) {
		colorIsBlack=true;
	}
}
var oneStep=function(line,col,colorIsBlack){
	//colorIsBlack=黑棋=先手
	context.beginPath();
	//arc(x,y,半径12,0,2pi)
	context.arc(15+col*30,15+line*30,12,0,Math.PI*2);
	context.closePath();
	/**
createRadialGradient(xStart, yStart, radiusStart, xEnd, yEnd, radiusEnd)
*/
	var gradient=context.createRadialGradient(15+col*30-2,15+line*30-2,12,15+col*30,15+line*30,0);
	if(colorIsBlack){
	   gradient.addColorStop(0,"#0a0a0a");
		 gradient.addColorStop(1,"#636766");
		 
	 }else{
		 gradient.addColorStop(0,"#d1d1d1");
		  gradient.addColorStop(1,"#f9f9f9");
		 
	}
	//渐变色
	context.fillStyle=gradient;
	context.fill();
};

var layerCalc=function(){
	/**
		层数计算
*/
	

for (var line = 0; line <15; line++) {
	solid[line]=[];
	for (var col = 0; col < 15; col++) {
		solid[line][col]=[];
	}
}
	
	
	
//是否等价于java中的     bool solid[][][]=new boolean[572][15][15]
/**
赢法数组的索引layer
*/

//横向  从左上至右开始计算 ht t t t t .dlinerectlineon
for(var line=0;line<15;line++){
	for(var col=0;col<=10;col++){
		for(var k=0;k<5;k++){
			//行固定,列变化
			solid[line][col+k][layer]=true;
		}
		layer++;
	}
}
//layer值11*15=165

//竖向,从左上到下
/**
ht
t
t
t
t
*/
for(var line=0;line<15;line++){
	for(var col=0;col<=10;col++){
		for(var k=0;k<5;k++){
			//行变化,列不变
			solid[col+k][line][layer]=true;
		}
		layer++;
}
}
//layer值165*2=330;

//斜线方向,大方向左上到右下,0可以作为起始
/**
ht
	t
		t
			t
				t
*/
for(var line=0;line<=10;line++){
	for(var col=0;col<=10;col++){
		for(var k=0;k<5;k++){
			solid[line+k][col+k][layer]=true;
		}
		layer++;
	}
}

/**
				ht
			t
		t
	t
t
*/
for(var line=0;line<=10;line++){
	for(var col=4;col<15;col++){
		for(var k=0;k<5;k++){
			
			solid[line+k][col-k][layer]=true;
		}
		layer++;
	}
}
	console.log(layer);
	
	//赢法数组置零初始化
	for (var i = 0; i <layer; i++) {
		manWin[i]=0;
		pcWin[i]=0;
	}
};
