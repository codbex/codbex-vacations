angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveBalance/LeaveBalanceService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'LeaveBalance successfully created';
		let propertySuccessfullyUpdated = 'LeaveBalance successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'LeaveBalance Details',
			create: 'Create LeaveBalance',
			update: 'Update LeaveBalance'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadSelect', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-vacations-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'LeaveBalance' && e.view === 'LeaveBalance' && e.type === 'entity');
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
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsEmployee = data.optionsEmployee;
				$scope.action = 'update';
			});
		}});

		$scope.serviceEmployee = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEBALANCE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-vacations.LeaveBalance.LeaveBalance.clearDetails');
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

		//----------------Dropdowns-----------------//	
	});