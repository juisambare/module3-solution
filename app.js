(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
      var ddo = {
        templateUrl: 'shoppingList.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: ShoppingListDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };

      return ddo;
    }
  function ShoppingListDirectiveController() {
  var list = this;
}
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var shoppingList = this;
    shoppingList.found=[];
    shoppingList.searchString = "";
    shoppingList.errorMessage = "";

    shoppingList.triggerSearch = function(){
      shoppingList.errorMessage = "";
      shoppingList.found = [];
      if(shoppingList.searchString){
        var promise = MenuSearchService.getMatchedMenuItems(shoppingList.searchString);
        promise.then(function (response) {
          shoppingList.found = response;
          if(shoppingList.found.length === 0){
            shoppingList.errorMessage = "Nothing found";
          }
        }).catch(function (error) {
          console.log(error);
        });
      }else{
        shoppingList.errorMessage = "Nothing found";
      }


    };
    shoppingList.removeItem = function(index){
      shoppingList.found.splice(index,1);
    };
  }
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
    var foundItems = [];
    service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
      }).then(function(result) {
        foundItems = [];
        result.data.menu_items.forEach(function(entry) {
          if(entry.description.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1){
            foundItems.push(entry);
          }
        });
        return foundItems;
      });
    };
  }
})();
