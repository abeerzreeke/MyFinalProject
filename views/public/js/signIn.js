class Play {

    constructor() {
        this.cardsFlip = [];
        this.allFlips = [];
        this.levelGame1;
        this.levelGame2;
        this.changeGridView()
        this.correctSound = new Audio('./sound/yofe.mp3');
        this.retry = new Audio('./sound/retry.mp4');
        this.gameplay;
        this.name;
        this.soundGameSound = new Audio('./sound/voicegame.mp3');
        this.soundGameSimon = new Audio('./sound/qusimon.mp3');
        this.counterClickGame1 = 0;
    }

    gamePlay(flag, level, gameName=null) { 

        console.log("SHOULDN'T SEE THIS");

        $('.animalgameinner').html('');
        $('.hebrow').html('<img class="hebBtu2" src="./imgs/heb.png" style="width: 100px; height: 100px;">');

        if (gameName == "homegame") { return this.createHomeGame(); } 
        if (gameName == "songame") { return this.createSonGame(); } 
        if (gameName == "realgame") { return this.createRealGame(); }

        this.gameplay = flag;
        this.name = gameName;
        this.myRandomNumber = [];
        this.gameRandom = [];
        let randomAnimal = Math.floor(Math.random() * level);
        // numberOfImages = 0;
        for (let i = 0; i < level; ++i) {
            let randomAnimals = Math.floor(Math.random() * 50);
            if (this.check(randomAnimals)) {
                i--;
            } else {
                this.myRandomNumber.push(randomAnimals) //adds the pic of animal to the array
                if (!flag) {
                    if (level >= 12) {
                        level = 12;
                    }
                    this.createRemmGame(randomAnimals, level, false);
                    this.levelGame2 = level;
                    localStorage.levelGame2 = level
                    if (gameName == "simongame") {
                        $('.levelPass').html('<img class="resound1" src="./imgs/resound.png" style="width: 100px; height: 100px;">');
                        $('.hebrow').html('<img class="hebBtu1" src="./imgs/heb.png" style="width: 100px; height: 100px;">');
                        setTimeout(() => {
                            this.soundGameSimon.currentTime = 0;
                            this.soundGameSimon.play()
                            this.playCorrectSound1(true);
                        }, 200);
                    } else {
                        $('.levelPass').html('<img class="resound" src="./imgs/resound.png" style="width: 100px; height: 100px;">');
                        $('.hebrow').html('<img class="hebBtu" src="./imgs/heb.png" style="width: 100px; height: 100px;">');
                        setTimeout(() => {
                            this.soundGameSound.currentTime = 0;
                            this.soundGameSound.play()
                            this.playCorrectSound(true);
                        }, 200);
                    }
                }
                this.gameRandom.push.apply(this.gameRandom, [randomAnimals, randomAnimals]);
                if (i == randomAnimal) {
                    this.correctAnimal = randomAnimals;
                }
            }
        }
        if (flag) {
            if (level >= 50) { level = 50; }
            $('.levelPass').html(`
                <img class="prevlevel" src="./imgs/Next-level.png" style="width: 100px; height: 100px;">
                <img class="nextlevel" src="./imgs/Next-level.png" style="width: 100px; height: 100px;">
            `);
            localStorage.levelGame1 = level
            this.levelGame1 = level;
            this.createRandomCards();
            this.maxlevel(level);
        }
        this.changeGridView(level)
    }
    
    createRandomCards() {
        let game_length = this.gameRandom.length;
        for (let i = 0; i < game_length; i++) {
            let index = Math.floor(Math.random() * this.gameRandom.length);
            let myRandomNumber = this.gameRandom[index];
            this.createRemmGame(myRandomNumber, this.levelGame1, true);
            this.gameRandom.splice(index, 1);
        }
    }

    createRemmGame(randomAnimals, level, flag) {
        this.counterClickGame1 = 0;
        console.log('level', level);
        let divSize = "col-md-2 animal1";
        switch (level - 1) {
            case 1:
                divSize = "col-md-6 animal1"
                break;
            case 2:
                divSize = "col-md-4 animal1"
                break;
            default:
                divSize = "col-md-2"
                break;
        }
        let AnimalDiv = $('<div class="' + divSize + '"></div>');
        let img = $('<img class="fliper"  src="./imgs/card.png">');
        img.data("animal", randomAnimals);
        if (!flag) {
            if (this.name == "simongame") {
                this.Class = 'simonGameImg'
            } else {
                this.Class = 'soundGameImg'
            }
        } else {
            this.Class = 'animalimgGame';
            AnimalDiv.append(img)
        }
        let img2 = $('<img class="' + this.Class + '"src="./imgs/animals/' + randomAnimals + '.jpg">');
        if (!flag) {
            img2.data("animal", randomAnimals);
            console.log(randomAnimals)
        }
        $('.animalgameinner').append(AnimalDiv.append(img2))
    }

    createHomeGame() {
        $('.animalgameinner').html(`
                <div class="header">
                    <p class="chances"></p>
                </div>
                <div class="content">
                    <div class="question">
                        <img src="" />
                        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div class="answers">

                    </div>
                </div>
        `);
        home_game_start();
    }

    createSonGame() {
        $('.animalgameinner').html(`
                <div class="header">
                    <p class="chances"></p>
                </div>
                <div class="content">
                    <div class="question">
                        <img src="" />
                        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div class="answers">

                    </div>
                </div>
        `);
        son_game_start();
    }

    createRealGame() {
        $('.animalgameinner').html(`
                <div class="header">
                    <p class="chances"></p>
                </div>
                <div class="content">
                    <div class="question">
                        <img src="" />
                        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div class="answers">

                    </div>
                </div>
        `);
        real_game_start();
    }

    //בדיקה אם מספר שנבחר רנדומלי מהתמונה זהה לתמונה אחרת כי זאת משחק זכרון ואמור להיות זוג תמונות זהות
    check(randomNum) {
        for (let num of this.myRandomNumber) {
            if (num == randomNum) {
                return true
            }
        }
        return false;
    }

    cardFlipCheck(that) {
        const flipCardSound = new Audio('./sound/cardFlip.wav');
        $(that).hide().siblings().show();
        flipCardSound.play();
        this.cardsFlip.push(that);
        let Examp = this.cardsFlip;
        if (Examp.length == 2) {
            this.CheckinCorrect(Examp)
            this.cardsFlip = []
        }
    }

    //remm
    CheckinCorrect(Examp) {
        if ($(Examp[0]).data("animal") != $(Examp[1]).data("animal")) {
            setTimeout(() => {
                $(Examp).show().siblings().hide()
            }, 1000);
        } else {
            this.correctSound.currentTime = 0;
            this.correctSound.play();
            this.allFlips.push.apply(this.allFlips, this.cardsFlip);
            this.checkWin1()
        }
    }

    checkWin1() {
        const correctSound = new Audio('./sound/kids.mp3');
        if (this.allFlips.length == this.levelGame1 * 2) {
            this.correctSound.currentTime = 0;
            correctSound.play();
            this.createNextLevel("remmGaNext", "remmGaRep")
            this.allFlips = [];
        }
        if (this.allFlips.length == 100) {
            alert("كل الاحترام")
        }
    }

    changeGridView(levelGame1) {
        // if (levelGame1 >= 5) {
        //     $('.animalgameinner').css({ "grid-template-columns": "25% 25% 25% 25%" })
        //     $('.animalgameinner').children().css({ "height": "100%" })
        // }
        // if (levelGame1 >= 10) {
        //     $('.animalgameinner').css({ "grid-template-columns": "20% 20% 20% 20% 20%" })
        //     $('.animalgameinner').children().css({ "height": "100%" })
        // }
        // if ($(window).width() > 1500) {
        //     $('.animalgameinner').css({ "grid-template-columns": "10% 10% 10% 10% 10% 10% 10% 10% 10% " })
        // }
        // $(window).resize(function () {
        //     if ($(this).width() > 500) {
        //         $('.animalgameinner').css({ "grid-template-columns": "20% 20% 20% 20% 20%" })
        //     }
        //     if ($(this).width() > 1500) {
        //         $('.animalgameinner').css({ "grid-template-columns": "10% 10% 10% 10% 10% 10% 10% 10% 10% 10%" })
        //     }
        // });
    }

    //remmgame
    nextLevel1(flag) {
        if (this.levelGame1 < 50) {
            if (flag) {
                if (localStorage.maxlevel <= this.levelGame1) {
                    $('.nextlevel').hide()
                    $('.cover').empty()
                    $('.cover').append('<span>لا يمكنك لانتقال الى المرحله التاليه بدون اتمام المرحله السابقه</span>')
                    $('.cover').show(() => {
                        setTimeout(() => {
                            $('.cover').hide()
                            $('.nextlevel').show()
                        }, 3000);
                    })
                    return;
                }
            }
            if (this.gameplay) {
                this.gamePlay(true, ++this.levelGame1)
                $('.cover').slideUp();
            } else {
                this.gamePlay(false, ++this.levelGame1)
                $('.cover').slideUp();
            }
        }
    }

    prevLevel() {
        if (this.levelGame1 > 2) {
            this.gamePlay(true, --this.levelGame1)
        }
    }

    //to replay the game 
    rePeatLevel1() {
        if (this.gameplay) {
            this.gamePlay(true, this.levelGame1);
            $('.cover').slideUp();
        } else {
            this.gamePlay(false, this.levelGame1);
            $('.cover').slideUp();
        }
    }

    createNextLevel(id1, id2) {
        $('.cover').html(`
            <img class="nextlevel1 ${ id1 }" src="./imgs/next.png">
            <img class="repeatlevel ${ id2 }" src="./imgs/repeat.png">
        `).slideDown(3000);
    }

    //-------------------------------------------
    quesHebrowSound(that) {
        const btunHebSound = new Audio('./sound/QuesForSound.mpeg');
        // this.btunHebSound.currentTime = 0;
        btunHebSound.play();
    }

    quesHebrowSound1(that) {
        const btunHebSound1 = new Audio('./sound/zhoBale.mp3');
        btunHebSound1.play();
    }

    checkVoiceCorrect(id) {
        if (this.correctAnimal == id) {
            const correctSound = new Audio('./sound/kids.mp3');
            this.correctSound.currentTime = 0;
            this.correctSound.play()
            this.correctSound.currentTime = 0;
            correctSound.play();
            this.nextLevel2();
            update_points();
        } else {
            this.retry.currentTime = 0;
            this.retry.play()
        }
    }

    checkVoiceCorrect1(id) {
        if (this.correctAnimal == id) {
            const correctSound = new Audio('./sound/kids.mp3');
            this.correctSound.currentTime = 0;
            this.correctSound.play()
            this.correctSound.currentTime = 0;
            correctSound.play();
            this.nextLevel3();
            update_points();
        } else {
            // this.retry.currentTime = 0;
            this.retry.play()
        }
    }

    nextLevel2() {
        if (this.levelGame2 > 11) {
            this.gamePlay(false, this.levelGame2, "soundgame")
        } else {
            this.gamePlay(false, ++this.levelGame2, "soundgame")
        }
        $('.cover').slideUp();
    }

    nextLevel3() {
        if (this.levelGame2 > 11) {
            this.gamePlay(false, this.levelGame2, "simongame")
        } else {
            this.gamePlay(false, ++this.levelGame2, "simongame")
        }
        $('.cover').slideUp();
    }

    rePeatLevel1() {
        this.counterClickGame1 = 0;
        this.gamePlay(true, this.levelGame1);
        $('.cover').slideUp()
    }

    playCorrectSound1(flag) {
        audio10 = new Audio('./sound/justname/' + this.correctAnimal + '.mp3');
        if (flag) {
            setTimeout(() => {
                // let audio1 = new Audio('./sound/justsound/' + this.correctAnimal + '.mp3');
                // this.audio10.currentTime = 0;
                audio10.play();
            }, 3000);
        } else {
            // this.audio10.currentTime = 0;
            audio10.play();
        }
    }

    playCorrectSound(flag) {
        audio1 = new Audio('./sound/justsound/' + this.correctAnimal + '.mp3');
        if (flag) {
            setTimeout(() => {
                // let audio1 = new Audio('./sound/justsound/' + this.correctAnimal + '.mp3');
                // this.audio1.currentTime = 0;
                audio1.play();
            }, 3000);
        } else {
            // this.audio1.currentTime = 0;
            audio1.play();
        }
    }

    maxlevel(level) {
        if (!localStorage.maxlevel) {
            localStorage.maxlevel = level;
        }
        if (localStorage.maxlevel < level) {
            localStorage.maxlevel = level;
        }
    }

}

