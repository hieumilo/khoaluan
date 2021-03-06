angular.module('App')
.directive('dropZone',[
    function(){
        var config = {
            template:'<label class="drop-zone">'+
            '<input type="file" multiple accept="jpg" />'+
                         '<div ng-transclude></div>'+       // <= transcluded stuff
                         '</label>',
                         transclude:true,
                         replace: true,
                         require: '?ngModel',
                         link: function(scope, element, attributes, ngModel){
                            var files = element[0].querySelector('input');    
                            files.addEventListener('dragover', filesDragOver, false);
                            files.addEventListener('drop', filesFileSelect, false);
                            files.addEventListener('change', filesFileSelect, false);                
                            config.scope = scope;                
                            config.model = ngModel; 
                        }
                    }
                    return config;

            // Helper functions
            function filesDragOver(e) {
                e.stopPropagation(); e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
            }
            function filesFileSelect(e) {
                // console.log(this)
                e.stopPropagation();
                e.preventDefault();
                var files = e.dataTransfer ? e.dataTransfer.files: e.target.files;
                for (var i = 0, file; file = files[i]; ++i) {
                    // console.log(file);
                    var reader = new FileReader();
                    reader.onload = (function(file) {
                        return function(e) { 
                            
                            // Data handling (just a basic example):
                            // [object File] produces an empty object on the model
                            // why we copy the properties to an object containing
                            // the Filereader base64 data from e.target.result
                            var data={
                                data:e.target.result,
                                dataSize: e.target.result.length
                            };
                            for(var p in file){ data[p] = file[p] }
                                
                                config.scope.$apply(function(){ config.model.$viewValue.push(data) })
                        }
                    })(file);
                    reader.readAsDataURL(file);
                }
            }
        }
        ])