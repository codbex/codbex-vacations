angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
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

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-vacations-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'LeaveRequests' && e.view === 'LeaveRequest' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = [];
				$scope.optionsManager = [];
				$scope.optionsType = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				if (data.entity.EndDate) {
					data.entity.EndDate = new Date(data.entity.EndDate);
				}
				if (data.entity.ResolvedAt) {
					data.entity.ResolvedAt = new Date(data.entity.ResolvedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsType = data.optionsType;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsType = data.optionsType;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.StartDate) {
					data.entity.StartDate = new Date(data.entity.StartDate);
				}
				if (data.entity.EndDate) {
					data.entity.EndDate = new Date(data.entity.EndDate);
				}
				if (data.entity.ResolvedAt) {
					data.entity.ResolvedAt = new Date(data.entity.ResolvedAt);
				}
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.optionsManager = data.optionsManager;
				$scope.optionsType = data.optionsType;
				$scope.optionsStatus = data.optionsStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceEmployee = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceManager = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceType = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveTypeService.ts';
		$scope.serviceStatus = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveStatusService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveRequests.LeaveRequest.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEREQUEST)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-vacations.LeaveRequests.LeaveRequest.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createEmployee = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createManager = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createType = () => {
			Dialogs.showWindow({
				id: 'LeaveType-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'LeaveStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshEmployee = () => {
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
		};
		$scope.refreshManager = () => {
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
		};
		$scope.refreshType = () => {
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
		};
		$scope.refreshStatus = () => {
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
		};

		//----------------Dropdowns-----------------//	
	});