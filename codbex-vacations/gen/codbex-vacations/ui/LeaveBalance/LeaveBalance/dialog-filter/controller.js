angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsEmployee = params.optionsEmployee;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.Employee !== undefined) {
			filter.$filter.equals.Employee = entity.Employee;
		}
		if (entity.Year !== undefined) {
			filter.$filter.equals.Year = entity.Year;
		}
		if (entity.Granted !== undefined) {
			filter.$filter.equals.Granted = entity.Granted;
		}
		if (entity.Used !== undefined) {
			filter.$filter.equals.Used = entity.Used;
		}
		if (entity.Balance !== undefined) {
			filter.$filter.equals.Balance = entity.Balance;
		}
		Dialogs.postMessage({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-vacations.LeaveBalance.LeaveBalance.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'LeaveBalance-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});