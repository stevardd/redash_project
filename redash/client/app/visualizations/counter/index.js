import counterTemplate from './counter.html';
import counterEditorTemplate from './counter-editor.html';

function getRowNumber(index, size) {
  if (index >= 0) {
    return index - 1;
  }

  if (Math.abs(index) > size) {
    index %= size;
  }

  return size + index;
}

function CounterRenderer() {
  return {
    restrict: 'E',
    template: counterTemplate,
    link($scope) {
      const refreshData = () => {
        const queryData = $scope.queryResult.getData();
        if (queryData) {
          const rowNumber = getRowNumber($scope.visualization.options.rowNumber, queryData.length);
          const targetRowNumber =
            getRowNumber($scope.visualization.options.targetRowNumber, queryData.length);
          const counterColName = $scope.visualization.options.counterColName;
          const targetColName = $scope.visualization.options.targetColName;

          if ($scope.visualization.options.countRow) {
            $scope.counterValue = queryData.length;
          } else if (counterColName) {
            $scope.counterValue = queryData[rowNumber][counterColName];
          }
          if (targetColName) {
            $scope.targetValue = queryData[targetRowNumber][targetColName];

            if ($scope.targetValue) {
              $scope.delta = $scope.counterValue - $scope.targetValue;
              $scope.trendPositive = $scope.delta >= 0;
            }
          } else {
            $scope.targetValue = null;
          }
        }
      };

      $scope.$watch('visualization.options', refreshData, true);
      $scope.$watch('queryResult && queryResult.getData()', refreshData);
    },
  };
}

function CounterEditor() {
  return {
    restrict: 'E',
    template: counterEditorTemplate,
  };
}


export default function (ngModule) {
  ngModule.directive('counterEditor', CounterEditor);
  ngModule.directive('counterRenderer', CounterRenderer);

  ngModule.config((VisualizationProvider) => {
    const renderTemplate =
        '<counter-renderer ' +
        'options="visualization.options" query-result="queryResult">' +
        '</counter-renderer>';

    const editTemplate = '<counter-editor></counter-editor>';
    const defaultOptions = {
      counterColName: 'counter',
      rowNumber: 1,
      targetRowNumber: 1,
    };

    VisualizationProvider.registerVisualization({
      type: 'COUNTER',
      name: 'Counter',
      renderTemplate,
      editorTemplate: editTemplate,
      defaultOptions,
    });
  });
}
