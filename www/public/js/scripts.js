(function(){
    var scroll = function(){
        if(window.scrollY>70){
            document.querySelector("#left_menu").classList.add('fixed');
        } else {
            document.querySelector("#left_menu").classList.remove('fixed');
        }
        
        if(window.scrollY>88){
            document.querySelector("#content_menu").classList.add('fixed');
        } else {
            document.querySelector("#content_menu").classList.remove('fixed');
        }
    };
    var timer;
    window.addEventListener('scroll', function(){
        if (timer == null) {
            scroll();
            timer = window.setTimeout(function(){
                timer = null;
                scroll();
            }, 15);
        }
     });
    
     document.querySelector("#to_top").addEventListener('click', function() {
        window.scrollTo(0,0);
     })
})();