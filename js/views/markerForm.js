define(['./Container',
    'Cesium',
    'spectrum'
     ],function(Container,
     Cesium
   ){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var handlerPolygon;
    var instance;
    var htmlStr = [
        '<main style="position : absolute;left : 75%; top : 5%;width: 300px">',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<input id="objectTab1" type="radio" name="objectTab" checked>',
        '<label for="objectTab1" style="font-size: 13px">' + "添加点" + '</label>',
        '<input id="objectTab2" type="radio" name="objectTab">',
        '<label for="objectTab2" style="font-size: 13px">' + "添加线" + '</label>',
        '<input id="objectTab3" type="radio" name="objectTab" >',
        '<label for="objectTab3" style="font-size: 13px">' + "添加面" + '</label>',
        // '<input id="objectTab4" type="radio" name="objectTab" >',
        // '<label for="objectTab4" style="font-size: 13px">' + "添加粒子" + '</label>',
        '<section id="objectContent1">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">符号库</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<p id="icons"></p>',
        '</div>',
        '<div>',
        '<label style="font-size:13px">颜色选择器：</label><input  class="colorPicker" size="8" data-bind="value: material," id="colorPicker">',
        '</div><br>',
        '<a class="ui blue ribbon label">变换</a>',
            '<label id="markerX" style="font-size:13px;">绕X轴旋转</label>',
            '<input id="pitch" class="input" type="number" min="0" max="360" step="1.0" value="0" title="pitch">',
            '<label id="markerY" style="font-size:13px;">绕Y轴旋转</label>',
            '<input id="roll" class="input" type="number" min="0" max="360" step="1.0" value="0" title="roll">',
            '<label id="markerZ" style="font-size:13px;">绕Z轴旋转</label>',
            '<input id="heading" class="input" type="number" min="0" max="360" step="1.0" value="0" title="heading">',
            '<label id="markerR" style="font-size:13px;">缩放</label>',
            '<input type="number" id="scale" class="input" step="0.1" value="1" title="模型缩放比例"><br><br>',
            '<button type="button" id="del1" class="btn btn-info" style="float: right">'+ "删除" +'</button>',
        '</div>',
       '</section>',
        '<section id="objectContent2">',
        '<h1 class="title"></h1>',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">符号库</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td><span style="font-size: 25px" id="fullLine" class="iconfont icon-line"></span><label style="margin-right: -18px">实线</label></td>',
        '<td><span style="font-size: 25px" id="dottedLine" class="iconfont icon-xuxian"></span><label style="margin-right: -10px">虚线型</label></td>',
        '<td><span style="font-size: 25px" id="outline" class="iconfont icon-xiantiao"></span><label style="margin-right: -10px">轮廓线</label></td>',
        '<td><span style="font-size: 25px" id="arrowLine" class="iconfont icon-line-arrow"></span><label style="margin-right: -10px">箭头线</label></td>',
        '</tr>',
        '<tr>',
        '<td style="padding-top: 20px"><span style="font-size:25px;" id="glowLine" class="iconfont icon-xiancai5"></span><label style="margin-right: -10px">光晕线</label></td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</div>',
        // '<label style="font-size:13px;">线宽</label>',
        // '<input id="lineWidth" class="input" type="number">',
        // '<label style="font-size:13px;">线颜色</label>',
        // '<input id="lineColor" class="input" type="number">',
        // '<div class="square">',
        // '<label  style="width:100%;">'+ "可见区域颜色" +'</label><input class="colorPicker" id="colorPicker1"/>',
        // '</div>',
        // '<div class="square">',
        // '<label style="width:100%;">'+ "不可见区域颜色" +'</label><input class="colorPicker" id="colorPicker2"/>',
        // '</div>',
        '<button type="button" id="delAllLine" class="btn btn-info" style="float: right">'+ "清除" +'</button>',
        '</div><br>',
        '</section>',
        '<section id="objectContent3">',
        '<div>',
        '<h1 class="title"></h1>',
        '</div>',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">符号库</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="pureColor" class="iconfont icon-lansekuangicon"></span><label style="margin-right: -18px">纯色</label></td>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="gridding" class="iconfont icon-plus-gridview"></span><label style="margin-right: -10px">网格</label></td>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="stripe" class="iconfont icon-ic_texture_px"></span><label style="margin-right: -10px">条纹</label></td>',
        '</tr>',
        '</tbody>',
        '</table><br><br><br>',
        '</div>',
        '<div>',
        '<button type="button" id="delAllPolygon" class="btn btn-info" style="float: right">'+ "清除" +'</button>',

        '</div>',
        '</div>',
        '</section>',
        '<section id="objectContent4">',
        '<div>',
        '<h1 class="title"></h1>',
        '</div>',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">符号库</a><br><br>',
        '<div style="border:1px solid #2EC5AD">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="pureColor" class="iconfont icon-huoyan"></span><label style="margin-right: -18px">纯色</label></td>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="gridding" class="iconfont icon-plus-gridview"></span><label style="margin-right: -10px">网格</label></td>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" id="stripe" class="iconfont icon-ic_texture_px"></span><label style="margin-right: -10px">条纹</label></td>',
        '<td style="padding-top: 10px"><span style="font-size: 25px" class="iconfont icon-line-arrow"></span><label style="margin-right: -10px">箭头线</label></td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</div>',
        '<div>',
        '<button type="button" id="delAllPolygon" class="btn btn-info" style="float: right">'+ "清除" +'</button>',
        '<button type="button" id="addition3" class="btn btn-info" style="float: right">'+ "添加" +'</button>',
        '</div>',
        '</div>',
        '</section>',
        '</main>',
    ].join('');
    var defaultUrl;
    var handlerPoint;
    var handlerLine;
    var markerForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #addition2'  : 'onAddition2Clk',
            'click #addition3'  : 'onAddition3Clk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            viewer.infobox = false;
            var scene = viewer.scene;
            handlerPoint = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Point);
            instance = new Cesium.S3MInstanceCollection(scene._context);
            scene.primitives.add(instance);
            this.render();
            this.on('componentAdded',function(parent){
                $('main').each(function(index){
                    $(this).myDrag({
                        parent:'body',
                        randomPosition:false,
                        direction:'all',
                        handler:false,
                        dragStart:function(x,y){},
                        dragEnd:function(x,y){},
                        dragMove:function(x,y){}
                    });
                });
                $("#colorPicker").spectrum({
                    color: "2EC5AD",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#pitch").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(0,rotationValue,0),index);
                    }
                });
                $("#roll").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(0,0,rotationValue),index);
                    }
                });
                $("#heading").on("input change",function(){
                    var rotationValue = Cesium.Math.toRadians(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateRotation(new Cesium.HeadingPitchRoll(rotationValue,0,0),index);
                    }
                });
                $("#scale").on("input change",function(){
                    var scale = parseFloat(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateScale(new Cesium.Cartesian3(scale,scale,scale),index);
                    }
                });
                $("#colorPicker").on("input change",function(){
                    var color = Cesium.Color.fromCssColorString(this.value);
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateColor(color,index);
                    }
                });
                $("#del1").on("click",function(){
                    if(viewer.selectedEntity){
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateScale(new Cesium.Cartesian3(0,0,0),index);
                    }
                });
                $("#delAllLine").on("click",function(){
                    var entities =  viewer.entities.values;
                    for(var i = 0;i < entities.length;i++){
                        if(entities[i].polyline){
                            entities[i].polyline.show = false;
                        }
                    }
                });
                $("#delAllPolygon").on("click",function(){
                    var entities =  viewer.entities.values;
                    for(var i = 0;i < entities.length;i++){
                        if(entities[i].polygon){
                            entities[i].polygon.show = false;
                        }
                    }
                });
                $("#fullLine").on("click",function(){
                   createLineType(0);
                });
                $("#dottedLine").on("click",function(){
                    createLineType(1);
                });
                $("#outline").on("click",function(){
                    createLineType(2);
                });
                $("#arrowLine").on("click",function(){
                    createLineType(3);
                });
                $("#glowLine").on("click",function(){
                    createLineType(4);
                });
                $("#pureColor").on("click",function(){
                    createPolygonType(0);
                });
                $("#gridding").on("click",function(){
                    createPolygonType(1);
                });
                $("#stripe").on("click",function(){
                    createPolygonType(2);
                });

            });
            Cesium.loadJson('data/models.json').then(function(data){
                var result = data.s3mModels;
                for(var i = 0,j = result.length;i < j;i++){
                    addItem(result[i]);
                }
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },
        onAddition2Clk : function(evt){

            handlerLine.activeEvt.addEventListener(function(isActive){
                if(isActive == true){
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                }
                else{
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            handlerLine.drawEvt.addEventListener(function(result){
                handlerLine.polyline.show = false;
                var array = [].concat(result.object.positions);
                var position = [];
                for(var i = 0, len = array.length; i < len; i ++){
                    var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    var h=cartographic.height;
                    if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                        position.push(longitude);
                        position.push(latitude);
                        position.push(h);
                    }
                }
                var index = document.getElementById("lineMode").selectedIndex;
                switch (index){
                    case 0:
                    viewer.entities.add({
                        id : "en0",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            material : new Cesium.PolylineGlowMaterialProperty({
                                glowPower : 0.25,
                                color : Cesium.Color.YELLOW
                            })
                        }
                    }); break;
                    case 1:
                        viewer.entities.add({
                        id : "en1",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 5,
                            material : new Cesium.PolylineOutlineMaterialProperty({
                                color : Cesium.Color.ORANGE,
                                outlineWidth : 2,
                                outlineColor : Cesium.Color.RED
                            })
                        }
                    }); break;
                    case 2:
                        viewer.entities.add({
                        id : "en2",
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            followSurface : false,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE)
                        }
                    }); break;
                    case 3:
                         viewer.entities.add({
                            id : "en3",
                            polyline : {
                                positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                                width : 4,
                                material : new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.RED
                                })
                            }
                        }); break;
                    default:break;
                }
            });
            handlerLine.activate();
        },
        onAddition3Clk : function(evt){
            handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
            handlerPolygon.activeEvt.addEventListener(function(isActive){
                if(isActive == true){
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                }
                else{
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            handlerPolygon.drawEvt.addEventListener(function(result){
                // var array = [].concat(result.object.positions);
                // var position = [];
                // for(var i = 0, len = array.length; i < len; i ++){
                //     var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                //     var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                //     var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                //     var h=1000000;
                //     if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                //         position.push(longitude);
                //         position.push(latitude);
                //         position.push(h);
                //     }
                // }
                handlerPolygon.polygon.show = true;
                handlerPolygon.polyline.show = true;

                // var index = document.getElementById("polygonMode").selectedIndex;
                // switch (index){
                //     case 0:
                //         handlerPolygon.polygon.show = true;
                //         handlerPolygon.polyline.show = true; break;
                //     case 1:
                //         handlerPolygon.polygon.show = false;
                //         handlerPolygon.polyline.show = false;
                //         viewer.entities.add({
                //             polygon : {
                //                 hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                //                 material : new Cesium.StripeMaterialProperty({
                //                     evenColor : Cesium.Color.WHITE.withAlpha(0.5),
                //                     oddColor : Cesium.Color.BLUE.withAlpha(0.5),
                //                     repeat : 30.0
                //                 })
                //             }
                //         });
                //         break;
                //     case 2:   ; break;
                //     default:break;
                // }

            });
            handlerPolygon.activate();
        },

    });
    function addItem(data){
        var str = '<a id="marker"><img style="width: 10%;height: 100%; margin:8px" title=data.name src={thumbnail} id={name}></a>'.replace('{thumbnail}',data.thumbnail).replace('{name}', data.name);
        $('#icons').append(str);
        var $child =$("#"+data.name);
        $child.on('click',function(){
            defaultUrl = data.path;
            if($("img").hasClass("selected")){
                $("img").removeClass("selected");
            }
            else{
                $(this).addClass("selected");
            }
            handlerPoint.drawEvt.addEventListener(function(result){
                handlerPoint.clear();
                var point = result.object;
                instance.add(defaultUrl,{
                    position : point.position,
                    hpr : new Cesium.HeadingPitchRoll(parseFloat($("#heading").val()),parseFloat($("#pitch").val()),parseFloat($("#roll").val())),
                    scale : new Cesium.Cartesian3(parseFloat($("#scale").val()),parseFloat($("#scale").val()),parseFloat($("#scale").val())),
                });
                handlerPoint && handlerPoint.deactivate();
            });
            handlerPoint.activate();
        });
    };
    function createLineType(type) {
        var  handlerLine = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
        handlerLine.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerLine.drawEvt.addEventListener(function(result){
            handlerLine.polyline.show = false;
            var array = [].concat(result.object.positions);
            var position = [];
            for(var i = 0, len = array.length; i < len; i ++){
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h=cartographic.height;
                if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }
            switch (type){
                case 0:  handlerLine.polyline.show = true;break;
                case 1:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 4,
                            material : new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.RED
                            })
                        }
                    }); break;
                case 2:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 5,
                            material : new Cesium.PolylineOutlineMaterialProperty({
                                color : Cesium.Color.ORANGE,
                                outlineWidth : 2,
                                outlineColor : Cesium.Color.RED
                            })
                        }
                    }); break;
                case 3:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            followSurface : false,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE)
                        }
                    }); break;
                case 4:
                    viewer.entities.add({
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width : 10,
                            material : new Cesium.PolylineGlowMaterialProperty({
                                glowPower : 0.25,
                                color : Cesium.Color.YELLOW
                            })
                        }
                    }); break;
                default:break;
            }
        });
        handlerLine.activate();
    };
    function createPolygonType(type) {
        var handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        handlerPolygon.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerPolygon.drawEvt.addEventListener(function(result){
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            var array = [].concat(result.object.positions);
            var position = [];
            for(var i = 0, len = array.length; i < len; i ++){
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h=cartographic.height;
                if(position.indexOf(longitude)==-1&&position.indexOf(latitude)==-1){
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }

            switch (type){
                case 0:
                    handlerPolygon.polygon.show = true;break;
                case 1:
                    viewer.entities.add({
                        polygon : {
                            perPositionHeight :true,
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material : new Cesium.GridMaterialProperty({

                            })
                        }
                    });break;
                case 2:
                    viewer.entities.add({
                        polygon : {
                            perPositionHeight :true,
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material : new Cesium.StripeMaterialProperty({
                                // evenColor : Cesium.Color.WHITE.withAlpha(0.5),
                                // oddColor : Cesium.Color.BLUE.withAlpha(0.5),
                                repeat : 30.0
                            })
                        }
                    });break;
                case 2:   ; break;
                default:break;
            }

        });
        handlerPolygon.activate();
    }
    return markerForm;
});
