import template from './parameters.html';
import parameterSettingsTemplate from './parameter-settings.html';

const ParameterSettingsComponent = {
  template: parameterSettingsTemplate,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller() {
    'ngInject';

    this.parameter = this.resolve.parameter;
  },
};

function ParametersDirective($location, $uibModal) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      parameters: '=',
      syncValues: '=?',
      editable: '=?',
      changed: '&onChange',
    },
    template,
    link(scope) {
      // is this the correct location for this logic?
      if (scope.syncValues !== false) {
        scope.$watch('parameters', () => {
          if (scope.changed) {
            scope.changed({});
          }
          scope.parameters.forEach((param) => {
            if (param.value !== null || param.value !== '') {
              $location.search(`p_${param.name}`, param.value);
            }
          });
        }, true);
      }
      // These are input as newline delimited values,
      // so we split them here.
      scope.extractEnumOptions = (enumOptions) => {
        if (enumOptions) {
          return enumOptions.split('\n');
        }
        return [];
      };
      scope.showParameterSettings = (param) => {
        $uibModal.open({
          component: 'parameterSettings',
          resolve: {
            parameter: param,
          },
        });
      };
    },
  };
}

export default function (ngModule) {
  ngModule.directive('parameters', ParametersDirective);
  ngModule.component('parameterSettings', ParameterSettingsComponent);
}
