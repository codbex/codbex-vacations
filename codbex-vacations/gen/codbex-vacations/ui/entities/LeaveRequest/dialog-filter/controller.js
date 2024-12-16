angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-vacations.entities.LeaveRequest';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.StartDateFrom) {
				params.entity.StartDateFrom = new Date(params.entity.StartDateFrom);
			}
			if (params?.entity?.StartDateTo) {
				params.entity.StartDateTo = new Date(params.entity.StartDateTo);
			}
			if (params?.entity?.EndDateFrom) {
				params.entity.EndDateFrom = new Date(params.entity.EndDateFrom);
			}
			if (params?.entity?.EndDateTo) {
				params.entity.EndDateTo = new Date(params.entity.EndDateTo);
			}
			if (params?.entity?.ApprovalDateFrom) {
				params.entity.ApprovalDateFrom = new Date(params.entity.ApprovalDateFrom);
			}
			if (params?.entity?.ApprovalDateTo) {
				params.entity.ApprovalDateTo = new Date(params.entity.ApprovalDateTo);
			}
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsManager = params.optionsManager;
		}

		$scope.filter = function () {
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
			if (entity.Number) {
				filter.$filter.contains.Number = entity.Number;
			}
			if (entity.Employee !== undefined) {
				filter.$filter.equals.Employee = entity.Employee;
			}
			if (entity.StartDateFrom) {
				filter.$filter.greaterThanOrEqual.StartDate = entity.StartDateFrom;
			}
			if (entity.StartDateTo) {
				filter.$filter.lessThanOrEqual.StartDate = entity.StartDateTo;
			}
			if (entity.EndDateFrom) {
				filter.$filter.greaterThanOrEqual.EndDate = entity.EndDateFrom;
			}
			if (entity.EndDateTo) {
				filter.$filter.lessThanOrEqual.EndDate = entity.EndDateTo;
			}
			if (entity.Days !== undefined) {
				filter.$filter.equals.Days = entity.Days;
			}
			if (entity.Type !== undefined) {
				filter.$filter.equals.Type = entity.Type;
			}
			if (entity.Status !== undefined) {
				filter.$filter.equals.Status = entity.Status;
			}
			if (entity.Reason) {
				filter.$filter.contains.Reason = entity.Reason;
			}
			if (entity.ApprovalDateFrom) {
				filter.$filter.greaterThanOrEqual.ApprovalDate = entity.ApprovalDateFrom;
			}
			if (entity.ApprovalDateTo) {
				filter.$filter.lessThanOrEqual.ApprovalDate = entity.ApprovalDateTo;
			}
			if (entity.Manager !== undefined) {
				filter.$filter.equals.Manager = entity.Manager;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("LeaveRequest-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);