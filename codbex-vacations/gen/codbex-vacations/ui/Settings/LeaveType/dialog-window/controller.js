angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/Settings/LeaveTypeService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'LeaveType successfully created';
		let propertySuccessfullyUpdated = 'LeaveType successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'LeaveType Details',
			create: 'Create LeaveType',
			update: 'Update LeaveType'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadSelect', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.formHeadUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.Settings.LeaveType.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVETYPE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCreate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-vacations.Settings.LeaveType.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVETYPE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToUpdate', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVETYPE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'LeaveType-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});