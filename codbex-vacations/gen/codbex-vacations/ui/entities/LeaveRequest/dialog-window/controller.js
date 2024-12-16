angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-vacations.entities.LeaveRequest';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-vacations/gen/codbex-vacations/api/entities/LeaveRequestService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "LeaveRequest Details",
			create: "Create LeaveRequest",
			update: "Update LeaveRequest"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.StartDate) {
				params.entity.StartDate = new Date(params.entity.StartDate);
			}
			if (params.entity.EndDate) {
				params.entity.EndDate = new Date(params.entity.EndDate);
			}
			if (params.entity.ApprovalDate) {
				params.entity.ApprovalDate = new Date(params.entity.ApprovalDate);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsManager = params.optionsManager;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create LeaveRequest: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("LeaveRequest", "LeaveRequest successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update LeaveRequest: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("LeaveRequest", "LeaveRequest successfully updated");
			});
		};

		$scope.serviceEmployee = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceType = "/services/ts/codbex-vacations/gen/codbex-vacations/api/entities/LeaveTypeService.ts";
		$scope.serviceStatus = "/services/ts/codbex-vacations/gen/codbex-vacations/api/entities/LeaveStatusService.ts";
		$scope.serviceManager = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("LeaveRequest-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);