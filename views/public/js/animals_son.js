class Sons  {

    constructor() {
        this.animals
        this.id;
        this.arabic = null;
        this.hebrew = null;
        this.animal = null;
    }
    
    createSons(Sons) {
        var $sons = $('.table_container .sons');
        fetch("http://localhost:8888/table/animals", { 
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' }, 
        }).then((res) => (res.json())).then((data) => {
            $sons.html('');
            this.animals = data['result'];
            $.each(this.animals, (index, animal) => {
                var url = `../../uploads/son/${ animal['id'] }-${ animal['name'] }.png`;
                $.get(url)
                    .done(function() { 
                        $sons.append(`
                            <div class="son" data-id="${ animal.id }" data-name="${ animal.name }">
                                <img src="${ url }">
                            </div>
                        `);
                    }).fail(function(e) {
                        console.log(animal['name'] + " Not EXIST")
                        console.log(e)
                    });
            });
            $sons.show();
        });
    }

    preview_model(id, name) {
        //לחצה על קפטור שמיעת שם הבן 
        if(this.audio) {
            this.audio.pause();
        }
        
        //לחיצה על כפתור לפני 
        if(id == "prev") {
            var $element = $('.son[data-id="' + $(".preview_model").attr("id") + '"]').prev();
            $element = $element.length ? $element: $('.son:last-child')
            id = $element.data("id"); 
            $('.son[data-id="' + id + '"]').click();
            return;
        }
        //לחיצה על כפתור אחרי
        if(id == "next") {
            var $element = $('.son[data-id="' + $(".preview_model").attr("id") + '"]').next();
            $element = $element.length ? $element: $('.son:first-child').next() 
            id = $element.data("id"); 
            $('.son[data-id="' + id + '"]').click();
            return;
        }
        //הערךך של ה אי די אם יש ??
        if(parseFloat(id) || id == "0") { this.animalpageid = id; }
        //הקול והשם המתאים לקל תמונה
        this.createAnimalPage(id, name);

        let file_arabic = new Audio(`./uploads/ar_son_name/${ id }-${ name }.mp3`);
        let file_hebrew = new Audio(`./uploads/he_son_name/${ id }-${ name }.mp3`);

        this.arabic = file_arabic;
        this.hebrew = file_hebrew;

        setTimeout(() => {
            this.arabic.play();
            setTimeout(() => {
                this.hebrew.play();
            }, 3000);
        }, 1000);
    }

    createAnimalPage(id, name) {
        $('.preview_model').attr("id", id).empty();
        $('.preview_model')
            .append(`<img class="main" src="./uploads/son/${ id }-${ name }.png">`)
            .append('<img class="hide" src="./imgs/x.png">')
            .append('<img class="play" lang="AR" src="./imgs/arab.jpg">')
            .append('<img class="play" lang="HE" src="./imgs/heb.png">');

        if (id == 0) { $('.prev').remove() }
        if (id == 9) { $('.next').remove() }
            
        $('.preview_model').show();
    }
    
    //שתיקה לקול
    pause_sound() {
        this.arabic.pause();
        this.hebrew.pause();
    }

    //הפעלת והשקטת הקול
    play_sound(sound) {
        this.pause_sound();
        if(sound == "AR") { return this.arabic.play() }
        if(sound == "HE") { return this.hebrew.play() }
    }
}

function init_sons() {

    sons = new Sons();
  
    $(document).on("click", ".preview_model .main", function () {
        var half = $(document).width() / 2;
        sons.preview_model(half > event.pageX ? "prev": "next");
    });

    $(document).on("click", ".preview_model .play", function() {
        sons.play_sound($(this).attr("lang"));
    });

    $(document).on("click", ".sons .son", function (e) {
        sons.preview_model($(this).data("id"), $(this).data("name"));
    });

    sons.createSons();

}