
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/tab1", {
        templateUrl : "tab1.html",
        controller : "mainctrl"
    })
    .when("/tab2", {
        templateUrl : "tab2.html",
        controller : "secondctrl"
    })
    .when("/tab3", {
        templateUrl : "tab3.html",
        controller : "thirdctrl"
    });
    
    });
    app.controller("mainctrl",function($scope){
        $scope.file=[{id : 1, name : 'Show All', type: "photos" },
			{id : 2, name : 'Text', type: "text" },
      {id : 3, name : 'Videos', type: "videos" },
      {id : 4, name : 'Photos', type: "photos"}];
      $scope.file1 = [
    {
      name: "photo1.jpg",
    
      type: "photos",
    },
    {
      name: "photo2.jpg",
     
      type: "photos"
    },
    {
      name: "video1.mp4",
 
      type: "videos"
    },
    {
      name: "video2.mp4",

      type: "videos"
    },
    {
      name: "text1.txt",
      type: "text"
    },
    {
      name: "text1.txt",
      type: "text"
    }
  ];
     
});
app.controller("secondctrl",function($scope){
    $scope.image=["images/image1.jpg","images/image2.jpg","images/image3.jpg","images/image4.jpg"]
    $scope.mythumb=function(x)
	{
       
        $scope.current=x;
        
    
		
	}
});
app.controller("thirdctrl",function($scope){
    $scope.items=["item1","item2","item3","item4"]
    $scope.adddata=function()
    {
        var newitem=$scope.add;
        $scope.items.pop();
        $scope.items.unshift(newitem);
    }
});