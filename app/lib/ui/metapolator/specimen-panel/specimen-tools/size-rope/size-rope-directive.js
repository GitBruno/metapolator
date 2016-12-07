define([
    'd3'
  , 'jquery'
], function(
    d3
  , $
) {
    "use strict";
    function sizeRopeDirective() {
        return {
            restrict : 'E'
          , controller : 'SizeRopeController'
          , replace : false
          , scope : {
                model : '=mtkModel'
              , type : '=mtkType'
            }
          , link : function(scope, element, attrs, ctrl) {
                var dS = 8, 
                    state = {
                        svg : d3.select(element[0]).append('svg').attr('width', 2 * dS + 2).attr('height', 2 * dS + 2),
                        diamondShape : (dS + 1) + ',1 ' + (2 * dS + 1) + ',' + (dS + 1) + ' ' + (dS + 1) + ',' + (2 * dS + 1) + ' 1,' + (dS + 1),
                        templayer : {
                            created: false,
                            element : $('<div class="templayer"></div>')[0],
                            svg : null, 
                            g : null, 
                            line : null, 
                            diamond : null
                        }, 
                        screenX : null, 
                        screenY : null, 
                        originX : null,
                        originY : null,
                        fontSize : null, 
                        pixelOffset  : null
                    },
                    drag = d3.behavior.drag().on('dragstart', function() {
                        if (!state.created) {
                            createTempElement();
                        }
                        lineAndDiamondToBase();
                        setInitialValues();
                        $(document.body).append(state.templayer.element);
                    }).on('drag', function() {
                        var ropeLength,
                          x = d3.event.x - dS,
                          y = d3.event.y - dS;
                        positionDiamond(x, y);
                        ropeLength = getRopeLength(x, -y); 
                        state.fontSize = getAbsolutePixels(ropeLength, state.pixelOffset);
                        scope.limitFontSize(state.fontSize);
                        scope.handleSVGbox();
                    }).on('dragend', function() {
                        diamondstatic.attr('class', 'size-rope-diamond');
                        $(state.templayer.element).remove();
                    })

                // create static diamond
                  , diamond = state.svg.append('g').call(drag),
                    diamondstatic = diamond.append('polygon').attr('points', state.diamondShape).attr('class', 'size-rope-diamond');
                
                    
                function createTempElement() {
                    state.screenX = $(element).offset().left;
                    state.screenY = $(element).offset().top;
                    state.originX = state.screenX + dS;
                    state.originY = state.screenY + dS;
                    state.templayer.svg = d3.select(state.templayer.element).append('svg').attr('width', '100%').attr('height', '100%');
                    state.templayer.g = state.templayer.svg.append('g');
                    state.templayer.line = state.templayer.g.append('line').attr('x1', state.originX).attr('y1', state.originY)
                        .attr('x2', (state.originX)).attr('y2', state.originY).attr('class', 'size-rope-line');
                    state.templayer.diamond = state.templayer.svg.append('g')
                        .attr('transform', 'translate(' + state.screenX + ',' + state.screenY + ')').append('polygon')
                        .attr('points', state.diamondShape).attr('class', 'size-rope-diamond');
                    state.created = true;
                }
                
                function positionDiamond(x, y) {
                    state.templayer.diamond.attr('transform', 'translate(' + x + ',' + y + ')');
                    state.templayer.line.attr('x2', (d3.event.x + state.screenX)).attr('y2', (d3.event.y + state.screenY));
                }
                
                function lineAndDiamondToBase() {
                    diamondstatic.attr('class', 'size-rope-diamond-invisible');
                    state.templayer.line.attr('x2', state.originX).attr('y2', state.originY);
                    state.templayer.diamond.attr('transform', 'translate(0,0)');
                }
                    
                function setInitialValues() {
                    state.fontSize = parseInt(scope.model.fontSize);
                    state.pixelOffset = getpixelOffset(state.fontSize);
                }
                
                function getAbsolutePixels(ropeLength, pixelOffset) {
                    var absolutePixels = ropeLength + pixelOffset;
                    if (absolutePixels > 399) {
                        return absolutePixels - 300;
                    } else {
                        return 11250 / (500 - absolutePixels) - 12.5;
                    }
                }

                function getRopeLength(xPosition, yPosition) {
                    var length;
                    if ((xPosition >= 0 && yPosition >= 0) || xPosition <= 0 && yPosition <= 0) {
                        length = Math.sqrt(Math.pow(xPosition, 2) + Math.pow(yPosition, 2));
                        if (yPosition < 0) {
                            length *= -1;
                        }
                    } else {
                        length = 0;
                    }
                    return length;
                }

                function getpixelOffset(fontSize) {
                    // this function handles the increase speed of the pulling
                    if (fontSize > 99) {
                        return 300 + fontSize;
                    } else {
                        return 500 - (11250 / (fontSize + 12.5));
                    }
                }
            }
        };
    }


    sizeRopeDirective.$inject = [];
    return sizeRopeDirective;
});
