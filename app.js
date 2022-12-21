document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimeId
    let downTimeId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimeId
    let rightTimeId
    let score = 0


    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        //doodlerBottomSpace = 10
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom =  doodlerBottomSpace + 'px'
    }

    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for(let i=0; i < platformCount; i++){
            let platGap = 600 / platformCount 
            let newPlatBottom = 100 + i * platGap
            let newPaltform = new Platform(newPlatBottom)
            platforms.push(newPaltform) 
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform =>{
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPaltform = new Platform(600)
                    platforms.push(newPaltform)
                }
            })
        }
    }  

    function jump(){
        clearInterval(downTimeId)
        isJumping = true
        upTimeId = setInterval(function() {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200 ){
                fall()
            }
        }, 30)
    }

    function fall(){
        clearInterval(upTimeId)
        isJumping = false
        downTimeId = setInterval(function(){
            doodlerBottomSpace -=5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if ((doodlerBottomSpace >= platform.bottom) && 
                (doodlerBottomSpace <= (platform.bottom + 15)) &&
                ((doodlerLeftSpace + 60) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)))
                {
                    startPoint = doodlerBottomSpace
                    console.log('landed')
                    jump()
                }
            })
        }, 30)
        
    }

    function gameOver(){
        console.log('gameover')
        isGameOver = true
        grid.innerHTML = score
        clearInterval(upTimeId)
        clearInterval(downTimeId)
        clearInterval(rightTimeId)
        clearInterval(leftTimeId)

    }


    function control(e){
        if (e.key === "ArrowLeft"){
            moveLeft()
        }
        else if (e.key === "ArrowRight"){
            moveRight()
        }
        else if (e.key === "ArrowUp"){
            isGoingLeft = false
            isGoingRight = false
            clearInterval(leftTimeId)
            clearInterval(rightTimeId)
        }
    }


    function moveLeft(){
        if (!isGoingLeft && !isGameOver){
            isGoingLeft = true
            if (isGoingRight){
                clearInterval(rightTimeId)
                isGoingRight = false
            }
            leftTimeId = setInterval(function() {
                if (doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
                } else moveRight()
            },20)
        }
    }

    function moveRight(){
        if (!isGoingRight && !isGameOver){
            isGoingRight = true
            if (isGoingLeft){
                clearInterval(leftTimeId)
                isGoingLeft = false
            }
            rightTimeId = setInterval(() => {
                if (doodlerLeftSpace <= 340){
                    doodlerLeftSpace += 5
                    doodler.style.left = doodlerLeftSpace + 'px'
                }
                else moveLeft()
            }, 20);
        }
    }

    function start(){
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})