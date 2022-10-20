const gameEl=document.getElementById('games');
const ctx=gameEl.getContext('2d');
const shapes=[
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ],[
        [2,2,2],
        [0,0,2],
        [0,0,0]
    ],[
        [3,3],
        [3,3],
    ],[
        [4,4,0],
        [0,4,4],
        [0,0,0]
    ],[
        [5,5,5],
        [5,0,0],
        [0,0,0]
    ],[
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],[
        [0,7,7],
        [7,7,0],
        [0,0,0]
    ]
];
const colors=[
    'aqua',
    'brown',
    'salmon',
    'teal',
    'mediumseagreen',
    'yellow',
    'gold',
];
const cols=10;
const rows=20;
const scaling=32;
class Pieces{
    constructor(shape,ctx){
        this.shape=shape;
        this.ctx=ctx;
        this.y=0;
        this.x=Math.floor(cols/2);
    }
    renderPiece(){
        this.shape.map((row,i)=>{
            row.map((cell,j)=>{
                if(cell!==0){
                    this.ctx.fillStyle=colors[cell];
                    this.ctx.fillRect(this.x+j,this.y+i,1,1)
                    this.ctx.lineWidth =.1;
                    this.ctx.strokeStyle='black';
                    this.ctx.strokeRect(this.x+j,this.y+i,1,1)
                }
            })
        })
    }
}
class GameModel{
    constructor(ctx){
        this.ctx=ctx;
        this.fallingPiece=null;
        this.grid=this.makeStartingGrid();
    }
    makeStartingGrid(){
        let grid=[];
        for(let i=0;i<rows;i++){
            grid[i]=[];
            for(let j=0;j<cols;j++){
                grid[i][j]=0;
            }
        }
        return grid;
    }
    collision(x,y,candidate=null){
        const shape= candidate|| this.fallingPiece.shape;
        const n= shape.length;
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                if(shape[i][j]>0){
                    let p=x+j;
                    let q=y+i;
                    if(p>=0&&p<cols&&q<rows){
                        if(this.grid[q][p]>0){
                            return true
                        }
                    }else{
                        return true
                    }
                }
            }
        }
        return false
    }
    renderGameState(){
        for(let i=0;i<this.grid.length;i++){
            for(let j=0;j<this.grid[i].length;j++){
                let cell=this.grid[i][j];
                this.ctx.fillStyle=this.color;
                this.ctx.fillRect(j,i,1,1)
                this.ctx.lineWidth =.1;
                this.ctx.strokeStyle='black';
                this.ctx.strokeRect(this.x+j,this.y+i,1,1)
            }
        }
        if(this.fallingPiece!==null){
            this.fallingPiece.renderPiece();
        }
    }
    moveDown(){
        if(this.fallingPiece===null){
            this.renderGameState()
            return
        }else if(this.collision(this.fallingPiece.x,this.fallingPiece.y+1)){
            const shape=this.fallingPiece.shape;
            const x=this.fallingPiece.x;
            const y=this.fallingPiece.y;
            shape.map((row,i)=>{
                row.map((cell,j)=>{
                    let p=x+j;
                    let q=y+i;
                    if(p>=0&&p<cols&&q<rows&&cell>0){
                        this.grid[q][p]=shape[i][j]
                    }
                })
            })
            this.fallingPiece=null;
        }else{
            this.fallingPiece.y+=1;
        }
        this.renderGameState()
    }
}
const model=new GameModel(ctx)
ctx.scale(scaling,scaling)
setInterval(()=>{
    newGameState()
},1000)
function newGameState(){
    if(model.fallingPiece===null){
        const rand=Math.floor(Math.random()*shapes.length)
        const newPiece=new Pieces(shapes[rand],ctx)
        model.fallingPiece=newPiece;
        model.moveDown();
    }else{
        model.moveDown();
    }
    function fullSend(){
        function allFilled(row){
            for(let x of row){
                if(x===0){
                    return false
                }
            }
            return true
        }
        
    }
}