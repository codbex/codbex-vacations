angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveBalance/LeaveDeductionService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete LeaveDeduction? This action cannot be undone.',
			deleteTitle: 'Delete LeaveDeduction?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.yes');
			translated.no = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-vacations:codbex-vacations-model.defaults.deleteTitle', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION)' });
			translated.deleteConfirm = LocaleService.t('codbex-vacations:codbex-vacations-model.messages.deleteConfirm', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-vacations-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'LeaveBalance' && e.view === 'LeaveDeduction' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'LeaveBalance' && e.view === 'LeaveDeduction' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'Balance',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id,
					selectedMainEntityKey: 'Balance',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveBalance.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveDeduction.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveDeduction.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveDeduction.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-vacations.LeaveBalance.LeaveDeduction.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let Balance = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.Balance = Balance;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION'),
						message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLF', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION'),
					message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToCount', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'LeaveDeduction-details',
				params: {
					action: 'select',
					entity: entity,
					optionsRequest: $scope.optionsRequest,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'LeaveDeduction-filter',
				params: {
					entity: $scope.filterEntity,
					optionsRequest: $scope.optionsRequest,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'LeaveDeduction-details',
				params: {
					action: 'create',
					entity: {
						'Balance': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'Balance',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsRequest: $scope.optionsRequest,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'LeaveDeduction-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'Balance',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsRequest: $scope.optionsRequest,
			},
				closeButton: false
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-vacations.LeaveBalance.LeaveDeduction.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION'),
							message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToDelete', { name: '$t(codbex-vacations:codbex-vacations-model.t.LEAVEDEDUCTION)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsRequest = [];


		$http.get('/services/ts/codbex-vacations/gen/codbex-vacations/api/LeaveRequests/LeaveRequestService.ts').then((response) => {
			$scope.optionsRequest = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Request',
				message: LocaleService.t('codbex-vacations:codbex-vacations-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsRequestValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsRequest.length; i++) {
				if ($scope.optionsRequest[i].value === optionKey) {
					return $scope.optionsRequest[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
