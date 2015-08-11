var View     = require('./view');
var template = require('../templates/draw-template');
var DrawingModel = require('../models/drawing-model');
var DrawingCollection= require('../collections/drawing-collection')

module.exports = View.extend({
    el: "#main",
    events: {
        'mousedown #canvas': 'mouseDownHandler',
        'mousemove #canvas' : 'mouseMoveHandler',
        'mouseup #canvas' : 'mouseUpHandler',
        'mouseleave #canvas' : 'mouseLeaveHandler',
        'click #saveCanvas' : 'saveCanvasHandler'
    },
    template: template,
    canvasWidth: 490,
    canvasHeight: 220,
    afterRender: function(){
        this.setupCanvas();
        this.fetchDrawings();
    },

    setupCanvas: function(){
        var canvasDiv = document.getElementById('canvasDiv');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.canvasWidth);
        canvas.setAttribute('height', this.canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        this._canvas = canvas;
        this.context = canvas.getContext("2d");
        this.clickX = new Array();
        this.clickY = new Array();
        this.clickDrag = new Array();
        this.paint;
    },

    mouseDownHandler: function(e){
        this.mouseX = e.pageX - this._canvas.offsetLeft;
        this.mouseY = e.pageY - this._canvas.offsetTop;
        this.paint = true;
        this.addClick(e.pageX - this._canvas.offsetLeft, e.pageY - this._canvas.offsetTop);
        this.redraw();
    },

    mouseMoveHandler: function(e){
        if(this.paint){
            this.addClick(e.pageX - this._canvas.offsetLeft, e.pageY - this._canvas.offsetTop, true);
            this.redraw();
        }
    },

    mouseUpHandler: function(e){
        this.paint = false;
    },

    mouseLeaveHandler: function(e){
        this.paint = false;
    },

    addClick: function(x, y, dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    },

    redraw: function(){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.strokeStyle = "#000000";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        for(var i=0; i < this.clickX.length; i++) {
           this.context.beginPath();
           if(this.clickDrag[i] && i){
             this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
            }else{
              this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.context.lineTo(this.clickX[i], this.clickY[i]);
            this.context.closePath();
            this.context.stroke();
         }
    },

    saveCanvasHandler: function(e){
        e.preventDefault();
        var self = this;
        var dataURL = this._canvas.toDataURL();
        var drawing_data = dataURL.replace(/^data:image\/\w+;base64,/, "");
        this.model = new DrawingModel({ drawing: drawing_data });
        this.model.save().then(
            function success(data){
                //$("#main").empty();
                self.render();
            },
            function error(e){
                console.log("error trying to save a drawing");
                console.log(e.responseText);
            }
        );
    },

    showDrawings: function(){
        $("#drawings").empty();
        this.collection.each(function(model){
            var img_path = model.get("drawing");
            $("#drawings").append("<img class='drawing' src='"+img_path+"'>");
        });
    },


    fetchDrawings: function(){
        var self = this;
        this.collection = new DrawingCollection();
        this.collection.fetch({
            url: BASE_URL + "/drawings",
            success: function(models){
                self.showDrawings();
            }
        });
    },


})
