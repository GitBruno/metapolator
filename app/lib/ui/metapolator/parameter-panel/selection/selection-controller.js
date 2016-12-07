define([
    'jquery'
  , 'metapolator/ui/metapolator/ui-tools/selectionTools'

], function(
    $
  , selection
) {
    "use strict";
    function SelectionController($scope, project) {
        var operatorId = 1;
        // Handling the parameter add panel 
        $scope.panelParameter = null;
        $scope.panelOperator = null;
        $scope.selection = selection;

    
        $scope.addParameterToPanel = function(parameter) {
            $scope.panelParameter = parameter;
            if ($scope.panelParameter && $scope.panelOperator) {
                addParameterToElements($scope.panelParameter, $scope.panelOperator);
            }
        };
    
        $scope.addOperatorToPanel = function(operator) {
            $scope.panelOperator = operator;
            if ($scope.panelParameter && $scope.panelOperator) {
                addParameterToElements($scope.panelParameter, $scope.panelOperator);
            }
        };

        function addParameterToElements(parameter, operator) {
            var elements = $scope.model.elements;
            for (var i = elements.length - 1; i >= 0; i--) {
                var element = elements[i];
                // each operator gets the same operator id
                // when there are stacked operators in a parameter, when can identify 
                // which operator has changed by it's id
                // after destacking, the id is set to null, so we always know that when an operator has an id
                // the operator is added during this selection session
                element.addParameterOperator(parameter, operator, operatorId);
                // add a rule for this element with this parameter
            }
            operatorId++;
            selection.closePanel();
            $scope.model.updateParameters();
        }

        $scope.togglePanel = function(event) {
            $scope.panelOperator = null;
            $scope.panelParameter = null;
            if (selection.panel.level === $scope.model.level && selection.panel.type === 'parameterOperator') {
                selection.closePanel();
            } else {
                selection.panel.top = $(event.target).offset().top + 20;
                selection.panel.left = $(event.target).offset().left + 20;
                selection.panel.level = $scope.model.level;
                selection.panel.type = 'parameterOperator';
            }
        };
    }

    SelectionController.$inject = ['$scope', 'project'];
    var _p = SelectionController.prototype;

    return SelectionController;
}); 