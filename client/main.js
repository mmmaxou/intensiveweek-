Template.main.onRendered(function() {
    this.autorun(function() {
        document.title = Session.get('documentTitle');
    });
});

Template.queries.events({
    "click #fullfill": function() {
        Meteor.call("reset", function (err, res) {
            if (err)
                console.log("!!", err);
        });
    }
});

Template.home.helpers({
    isConnected : function () {
        return isConnected()
    }
})

Template.citylist.helpers({
    cities: function() {
        return Cities.find();
    },
    activities: function() {
        return Activities.find();
    },
    commentsNumber : function (object) {
        if ( object == undefined) return 0;
        return object.length;
        //        console.log("comments Number : " + object.length)
    }
});

Template.navbar.helpers({
    template: function () {
        route = Router.current();
        return route? route.lookupTemplate() : 'home';
    }
});

Template.citylist.events({
    'load *': function(){
        $('.grid').isotope({
            getSortData: {
                name : ".cityName",
                comments : "[data-comments]",
                like : "[data-like]"
            },
            itemSelector: '.grid-item',
            stagger: 50
        });
        $(window).scroll(function(){                          
            if ($(this).scrollTop() > 150) {
                $('.home').fadeIn(300);
            } else {
                $('.home').fadeOut(300);
            }
        });
    },
    'click #destClick': function(){
        $('html, body').stop(true, false).animate({
            scrollTop: $("#dest").offset().top
        }, 1000);
    },
    'click #sort_az': function(){
        $('.grid').isotope({
            sortBy: 'name'
        });
    },
    'click #sort_date': function(){
        $('.grid').isotope({
            sortBy: 'original-order'
        });
    },
    'click #sort_likes': function(){
        $('.grid').isotope({
            sortBy: 'like'
        });
    },
    'click #sort_comments': function(){
        $('.grid').isotope({
            sortBy: 'comments',
            sortAscending: false
        });
    }
})

Template.cities.helpers({
    //    cities: function() {
    //        return Cities.find();
    //    },
    //    activities: function() {
    //        return Activities.find({});
    //    },
    isAnEvent: function(nature){
        return nature === "event";
    },
    isAPlace: function(nature){
        return nature === "place";
    },
    isConnected : function () {
        return isConnected()
    },
    isAdmin : function () {
        return isAdmin()
    },
    isPlaceEmpty : function (object) {
        return $('#placeWrapper').find("*").length == 0;
    },
    isEventEmpty : function (object) {
        return $('#eventWrapper').find("*").length == 0;
    }
});

Template.cities.events({
    'click #displayAddActivity' : function () {
        var a = $('#displayAddActivity').text();
        if (a == "+" ) {
            $('.formAddCity').fadeIn();
            $('#displayAddActivity').text("-");
        } else {
            $('.formAddCity').fadeOut();
            $('#displayAddActivity').text("+");
        }
    },
    'click #commentAdd': function(){
        $('#sectionAdd').fadeIn();
    },
    'submit form#sectionAdd': function (event) {
        event.preventDefault();

        var city = this;      
        var comment = {};
        const target = event.target;
        comment.text = target.comment.value;
        comment.date = new Date();
        comment.user = {
            _id : Meteor.user()._id,
            email : Meteor.user().emails[0].address
        }

        Meteor.call("addComment", city, comment, "city");
        toastSuccess("Comment added !")
        $('#sectionAdd').fadeOut();
        target.comment.value = "";
    },
    'click #descriptionButton' : function () {
        if( $('#descriptionButton').text() == "Edit") {
            $('#descriptionButtonCancel').fadeIn();
            $('#descriptionButton').text("Save");
            $('.wrapperCityDescription > p')
                .attr('contenteditable', 'true')
                .addClass('editable');
        }
        else if( $('#descriptionButton').text() == "Save") {
            $('.wrapperCityDescription > p')
                .attr('contenteditable', 'false')
                .removeClass('editable');
            $('#descriptionButtonCancel').fadeOut();
            $('#descriptionButton').text("Edit");

            Meteor.call("editDescription", this._id, "city", $(".wrapperCityDescription > p").text())
        }
    },
    'click #descriptionButtonCancel' : function () {
        $('.wrapperCityDescription > p')
            .attr('contenteditable', 'false')
            .removeClass('editable')
            .text(this.description);        
        $('#descriptionButtonCancel').fadeOut();
        $('#descriptionButton').text("Edit");
    },
    'click #like': function(){
        var user = isConnected();
        if(user != null) {
            user = Meteor.user();
            var city = this;

            //Regarde si l'utilisateur a déjà liké dans la database de l'activité
            if ( city.usersLiking != null ) {
                var check = !city.usersLiking.some(function(e){
                    return e == user._id;
                })
                } else {
                    var check = true;
                }



            console.log("User : " + user)
            console.log("Check : " + check)

            if ( check ) {
                Meteor.call("addLike", city, "city", user);
                toastSuccess("Successfully liked")   
            } else {  
                toastError("You already liked !");
            }
        }
    }
})

Template.navbar.helpers({
    template: function () {
        route = Router.current();
        return route? route.lookupTemplate() : 'home';
    }
});

Template.activities.helpers({
    isConnected : function () {
        return isConnected()
    },
    isAdmin : function () {
        return isAdmin()
    }
})

Template.home.events ({
    'load *': function(){
        $("#destlink").click(function(){
            $('html,body').stop(true, false).animate({
                scrollTop: $("#dest").offset().top
            },1000);
        });
        $("#destActive").addClass("active");
    }
});

Template.about.events ({
    //    Session.set('documentTitle', 'Awesome title');
    'load *': function(){

    }
});

function toastError (text) {         
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.error(text);
}

function toastSuccess (text) {         
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.success(text);
}

function isConnected() {
    var user = Meteor.user();
    if (user != null) {
        return true;
    }
    return false;
}

function isAdmin() {
    console.log("admin checking")
    if ( isConnected() ) {
        var user = Meteor.user();
        if( Admins.findOne({id: user._id}) != undefined )
            return true;
    }
    return false;
}

