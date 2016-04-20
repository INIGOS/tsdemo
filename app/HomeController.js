application.controller('HomeController', ['$scope','$http',  function ($scope,$http) {
    
    
    var currPairs=[];
    
    sentimentData.forEach(function(value,index){
        
        currPairs.push(value.currpair.trim().toUpperCase());
        
        
    });
    
  
    
    
    $scope.currencyPairs= jQuery.unique(currPairs);;

    
/*************************** Gauge ****************************************************/    
  var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // red
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // green
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $('#container-gauge').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: -5,
            max: 5,
            title: {
                text: 'Sentiment Score'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Sentiment Score',
            data: [3],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver"></span></div>'
            },
            tooltip: {
                valueSuffix: ''
            }
        }]

    }));
    
   
    
    /*************************** bubble chart ****************************************************/
    
    $('#container-bubbles').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        title: {
            text: 'Top Influencers'
        },

        xAxis: {
            gridLineWidth: 1
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            data: [
                [9, 81, 63],
                [98, 5, 89],
                [51, 50, 73],
                [41, 22, 14],
                [58, 24, 20],
                [78, 37, 34],
                [55, 56, 53],
                [18, 45, 70],
                [42, 44, 28],
                [3, 52, 59],
                [31, 18, 97],
                [79, 91, 63],
                [93, 23, 23],
                [44, 83, 22]
            ],
            marker: {
                fillColor: {
                    radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                    stops: [
                        [0, 'rgba(255,255,255,0.5)'],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                    ]
                }
            }
        } ]

    });
    
    
    /******************************* Heat map  *******************************************************/
    
    
    (function (H) {
        var Series = H.Series,
            each = H.each;

        /**
         * Create a hidden canvas to draw the graph on. The contents is later copied over
         * to an SVG image element.
         */
        Series.prototype.getContext = function () {
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.setAttribute('width', this.chart.chartWidth);
                this.canvas.setAttribute('height', this.chart.chartHeight);
                this.image = this.chart.renderer.image('', 0, 0, this.chart.chartWidth, this.chart.chartHeight).add(this.group);
                this.ctx = this.canvas.getContext('2d');
            }
            return this.ctx;
        };

        /**
         * Draw the canvas image inside an SVG image
         */
        Series.prototype.canvasToSVG = function () {
            this.image.attr({ href: this.canvas.toDataURL('image/png') });
        };

        /**
         * Wrap the drawPoints method to draw the points in canvas instead of the slower SVG,
         * that requires one shape each point.
         */
        H.wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function () {

            var ctx = this.getContext();

            if (ctx) {

                // draw the columns
                each(this.points, function (point) {
                    var plotY = point.plotY,
                        shapeArgs;

                    if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
                        shapeArgs = point.shapeArgs;

                        ctx.fillStyle = point.pointAttr[''].fill;
                        ctx.fillRect(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height);
                    }
                });

                this.canvasToSVG();

            } else {
                this.chart.showLoading('Your browser doesn\'t support HTML5 canvas, <br>please use a modern browser');

                // Uncomment this to provide low-level (slow) support in oldIE. It will cause script errors on
                // charts with more than a few thousand points.
                // arguments[0].call(this);
            }
        });
        H.seriesTypes.heatmap.prototype.directTouch = false; // Use k-d-tree
    }(Highcharts));


    var start;
    $('#container-heatmap').highcharts({

        data: {
            csv: document.getElementById('csv').innerHTML,
            parsed: function () {
                start = +new Date();
            }
        },

        chart: {
            type: 'heatmap',
            margin: [60, 10, 80, 50]
        },


        title: {
            text: 'Sentiment score - Historical',
            align: 'left',
            x: 40
        },

        subtitle: {
            text: '',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'datetime',
            min: Date.UTC(2016, 2, 15),
            max: Date.UTC(2016, 3, 20),
            labels: {
                align: 'left',
                x: 5,
                y: 14,
                format: '{value:%B}' // long month
            },
            showLastLabel: false,
            tickLength: 16
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}'
            },
           
           
           
           
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a'],
                [1, '#c4463a']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false,
            labels: {
                format: '{value}'
            }
        },

        series: [{
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day
            tooltip: {
               
            },
            turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
        }]

    });
    
    
    /********************************************** Time Series *****************************************/
     $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {
         console.log(data);

        $('#container-timeseries').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'EUR-USD sentiment score over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'USD to EUR',
                data: data
            }]
        });
    });
    
    
    
    /*************************change after currency selection **********************/
  
     $scope.$watch('selectedCurrPair', function(newValue, oldValue) {
         
         // Update gauge value
         
       var recCount=0;
         var scoreSum=0;
         var timeseriesData=[];
         
         
        sentimentData= sentimentData.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});
         
         sentimentData.forEach(function(value,index){
             
             if(value.currpair.trim() == newValue){
              recCount=recCount+1;   
                scoreSum= scoreSum + value.score; 
              var tempArray=[];
                
                 var tempDate= new Date(value.date.substring(0,10));
                 tempArray.push(tempDate.getTime());
                 tempArray.push(value.score);
                 
                 timeseriesData.push(tempArray);
                 
             }
         
         
         });
         
       
         
         if(recCount !=0){
         var avgScore=scoreSum.toFixed(2) / recCount;
            
           //  avgScore=parseFloat(avgScore).toFixed(2);
             
             
        
          chart = $('#container-gauge').highcharts();
        if (chart) {
            point = chart.series[0].points[0];
            
            point.update(parseFloat(avgScore.toFixed(2)));
        }
             
         }else{
             
          alert("No Data found");   
         }
       //------------------------------------------------------------
       //Update time series
       
           $('#container-timeseries').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text:  newValue
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Sentiment Score'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 5
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: newValue,
                data: timeseriesData
            }]
        });
         
         
         
       
    }, true);
    
    //---------------------------------------------------------------------
    
    //Update bubble chart
    
    var bubbleData=[];
    
    var currPair=[];
    influenceData.forEach(function(value,index){
    
        currPair.push(value.currency.trim());
       /* var tempArray=[];
        tempArray.push(value.currency.trim());
        tempArray.push(value.score);
        tempArray.push(value.score);*/
        
        var tempObject={};
        
        if(!isNaN(value.score)){
        tempObject.name=value.currency.trim();
        tempObject.y=value.score;
        tempObject.z=value.score;
        }
        bubbleData.push(tempObject);
    
    });
    
    currPair=jQuery.unique(currPair);
    
    console.log(bubbleData);
    
   $('#container-bubbles').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        title: {
            text: 'Top Influencers'
        },

        xAxis: {
             type:'category',
        },

       
        series: [{
            data:bubbleData,
            marker: {
                fillColor: {
                    radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                    stops: [
                        [0, 'rgba(255,255,255,0.5)'],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                    ]
                }
            }
        } ]

    });
    
    
    
    
  
}]);