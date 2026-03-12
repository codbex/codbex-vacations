angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'LeaveRequest successfully created';
		let propertySuccessfullyUpdated = 'LeaveRequest successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'LeaveRequest Details',
			create: 'Create LeaveRequest',
			update: 'Update LeaveRequest'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadSelect', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
			$scope.formHeaders.create = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
			$scope.formHeaders.update = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.StartDate) {
				params.entity.StartDate = new Date(params.entity.StartDate);
			}
			if (params.entity.EndDate) {
				params.entity.EndDate = new Date(params.entity.EndDate);
			}
			if (params.entity.ResolvedAt) {
				params.entity.ResolvedAt = new Date(params.entity.ResolvedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsEmployee = params.optionsEmployee;
			$scope.optionsManager = params.optionsManager;
			$scope.optionsType = params.optionsType;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceEmployee = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		
		$scope.optionsEmployee = [];
		
		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsEmployee = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Employee',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceManager = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		
		$scope.optionsManager = [];
		
		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsManager = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Manager',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceType = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveTypeService.ts';
		
		$scope.optionsType = [];
		
		$http.get('/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveTypeService.ts').then((response) => {
			$scope.optionsType = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceStatus = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveStatusService.ts';
		
		$scope.optionsStatus = [];
		
		$http.get('/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveStatusService.ts').then((response) => {
			$scope.optionsStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'LeaveRequest-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});