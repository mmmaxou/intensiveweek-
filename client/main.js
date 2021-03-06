//Template.main.onRendered(function() {
//    this.autorun(function() {
//        document.title = Session.get('documentTitle');
//    });
//});

Template.queries.events({
    "click #fullfill": function() {
        Meteor.call("reset", function (err, res) {
            if (err)
                {console.log("!!", err);}
            else {
                console.log(res)
            }
        });
    }
});

Template.navbar.helpers({
    template: function () {
        route = Router.current();
        return route? route.lookupTemplate() : 'home';
    }
});

Template.home.helpers({
    isConnected : function () {
        return isConnected()
    }
})
Template.home.events ({
    'load *': function(){
        $("#destArrow").click(function(){
            $('html,body').stop(true, false).animate({
                scrollTop: $("#dest").offset().top
            },1000);
        });
    }
});

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
Template.citylist.events({
    'load *': function(){
        
        setTimeout(function(){
            $('.grid').isotope({
                getSortData: {
                    name : ".cityName",
                    comments : "[data-comments]",
                    like : "[data-like]"
                },
                itemSelector: '.grid-item',
                percentPosition: true,
                stagger: 50,
                masonry : {
                    columnWidth: '.grid-item'
                }
            });
        },1000)
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
/*
Template.cities.helpers({
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
    isPlaceEmpty : function () {
        var city = this;
        var isEmpty = city.activities.some(function (e) {
            return e.nature == "place";
        })
        return !isEmpty;
    },
    isEventEmpty : function () {
        var city = this;
        var isEmpty = city.activities.some(function (e) {
            return e.nature == "event";
        })
        return !isEmpty;
    }
    
    
});
Template.cities.events({
    'click #displayAddActivity' : function () {
        var a = $('#displayAddActivity').text();
        var b = $('.formAddCity').hasClass("active");
        if (b == false) {
            $('.formAddCity')
                .fadeIn()
                .addClass("active");
            $('#displayAddActivity').text("-");
        }  else {
            $('.formAddCity')
                .fadeOut()
                .removeClass("active");
            $('#displayAddActivity').text("+");
        }
    },
    'click #commentAdd': function(){
        $('#sectionAdd').fadeIn();
    },
    'click #like': function(){
        var user = Meteor.user();
        
        if(user != null) {
            var city = this;
            
            //Regarde si l'utilisateur a déjà liké dans la database de l'activité
            if ( city.usersLiking != null ) {
                var check = !city.usersLiking.some(function(e){
                    return e == user._id;
                })
            } else {
                var check = true;
            }
            
            if ( check ) {
                Meteor.call("addLike", city, "city", user);
                toastSuccess("Successfully liked")   
            } else {  
                toastError("You already liked !");
            }
        }
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
        if( $('.wrapperCityDescription > p').hasClass("editable") ) {
            $('#descriptionButtonCancel').fadeIn();
            $('#descriptionButton').text("Save");
            $('.wrapperCityDescription > p')
                .attr('contenteditable', 'true')
                .addClass('editable');
        }
        else {
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
                toastSuccess("Successfully liked!")   
            } else {  
                toastError("You already liked!");
            }
        }
    }
})
*/
Template.navbar.helpers({
  template: function () {
    route = Router.current();
    return route? route.lookupTemplate() : 'home';
  }
});

Template.formActivity.events({
    'submit form': function (event) {
        event.preventDefault();

        var city = this || {picture: '/images/Aix/aix.jpg'};
        var activity = {};

        const target = event.target;

        activity.name = target.name.value;
        activity.description = target.description.value;
        activity.datestart = target.datestart.value;
        activity.dateend = target.dateend.value;
        activity.nature = target.nature.value;
        activity.comments = [];
        activity.editor = "TODO";
        activity.pictures = [];
        activity.like = 0;
        activity.usersLiking = [];

        console.log(activity)
        console.log("city :", city)
        console.log(Meteor.userId())

        // show the upload panel
        $('.uploadPanel').fadeIn();
        // hide the submit button
        $('#submit').fadeOut();
        // find the document corresponding to the user (his id is Meteor.userId())
        // TODO

        Activities.insert(activity, function(err, objectId){
            activity._id = objectId;
            Meteor.call("initUploadServerForActivity", city, activity);
        });

    },

    'change input[type=radio]' : function(){
        var input = $("#event");
        if ( input.prop("checked") == false) {
            $('#dates').fadeOut();
        } else { $('#dates').fadeIn();}
    },
});

Template.cityAdd.events({
    'submit form': function (event) {
        event.preventDefault();
        var city = {};

        const target = event.target;

        city.name = target.name.value;
        city.description = target.description.value;
        city.coordinates = {
            long : target.long.value,
            lat : target.lat.value
        }
        city.user = {
            _id : Meteor.user()._id,
            email : Meteor.user().emails[0].address
        }

        // show the upload panel
        $('.uploadPanel').fadeIn();
        // hide the submit button
        $('#submit').fadeOut();
        // find the document corresponding to the user (his id is Meteor.userId())


        Cities.insert(city, function(err, objectId){
            city._id = objectId;
            Meteor.call("initUploadServerForCity", city);
        });
    }
});

Template.activities.helpers({
    isConnected : function () {
        return isConnected()
    },
    isAdmin : function () {
        return isAdmin()
    },
    userAlreadyLiked : function () {
        var activity = this;
        var user = Meteor.user();
        
        if ( activity.usersLiking != null ) {
            var check = activity.usersLiking.some(function(e){
                return e == user._id;
            })
        } else {
            var check = false;
        }
        if (check) {
            return true
        } else {
            return false
        }
    },
    commentsNumber : function() {
        var activity = this;
        var nb = activity.comments.length;
        return nb;
    },
    dateFormat : function (date) {
        return date.toDateString();
    },
    isAnEvent: function(nature){
        return nature === "event";
    }
})

Template.activities.events({
    'click #commentAdd': function(){
        $('#sectionAdd').fadeIn();
    },
    'submit form#sectionAdd': function (event) {
        event.preventDefault();
        console.log("working");

        var activity = this;
        var comment = {};
        const target = event.target;
        comment.text = target.comment.value;
        var d = new Date();
        comment.date = d.toDateString();
        comment.user = {
            _id : Meteor.user()._id,
            email : Meteor.user().emails[0].address
        }

        Meteor.call("addComment", activity, comment, "activity");
        toastSuccess("Comment added !")
        $('#sectionAdd').fadeOut();
        target.comment.value = "";
    },
    'click #like': function(){
        var user = isConnected();
        if(user != null) {
            user = Meteor.user();
            var activity = this;

            //Regarde si l'utilisateur a déjà liké dans la database de l'activité
            if ( activity.usersLiking != null ) {
                var check = !activity.usersLiking.some(function(e){
                    return e == user._id;
                })
                } else {
                    var check = true;
                }

            console.log("User : " + user)
            console.log("Check : " + check)

            if ( check ) {
                Meteor.call("addLike", activity, "activity", user);
                toastSuccess("Successfully liked")                
            } else {
                toastError("You already liked !");
            }
        }
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

            Meteor.call("editDescription", this._id, "activity", $(".wrapperCityDescription > p").text())
        }
    },
    'click #descriptionButtonCancel' : function () {
        $('.wrapperCityDescription > p')
            .attr('contenteditable', 'false')
            .removeClass('editable')
            .text(this.description);        
        $('#descriptionButtonCancel').fadeOut();
        $('#descriptionButton').text("Edit");
    }
})

//Return 
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