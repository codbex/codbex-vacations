import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeaveBalanceEntity {
    readonly Id: number;
    Employee?: number;
    Year?: string;
    Type?: number;
    Granted?: number;
    Used?: number;
    Balance?: number;
}

export interface LeaveBalanceCreateEntity {
    readonly Employee?: number;
    readonly Year?: string;
    readonly Type?: number;
    readonly Granted?: number;
    readonly Used?: number;
}

export interface LeaveBalanceUpdateEntity extends LeaveBalanceCreateEntity {
    readonly Id: number;
}

export interface LeaveBalanceEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Year?: string | string[];
            Type?: number | number[];
            Granted?: number | number[];
            Used?: number | number[];
            Balance?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Employee?: number | number[];
            Year?: string | string[];
            Type?: number | number[];
            Granted?: number | number[];
            Used?: number | number[];
            Balance?: number | number[];
        };
        contains?: {
            Id?: number;
            Employee?: number;
            Year?: string;
            Type?: number;
            Granted?: number;
            Used?: number;
            Balance?: number;
        };
        greaterThan?: {
            Id?: number;
            Employee?: number;
            Year?: string;
            Type?: number;
            Granted?: number;
            Used?: number;
            Balance?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Year?: string;
            Type?: number;
            Granted?: number;
            Used?: number;
            Balance?: number;
        };
        lessThan?: {
            Id?: number;
            Employee?: number;
            Year?: string;
            Type?: number;
            Granted?: number;
            Used?: number;
            Balance?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Employee?: number;
            Year?: string;
            Type?: number;
            Granted?: number;
            Used?: number;
            Balance?: number;
        };
    },
    $select?: (keyof LeaveBalanceEntity)[],
    $sort?: string | (keyof LeaveBalanceEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveBalanceEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveBalanceEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveBalanceUpdateEntityEvent extends LeaveBalanceEntityEvent {
    readonly previousEntity: LeaveBalanceEntity;
}

export class LeaveBalanceRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVEBALANCE",
        properties: [
            {
                name: "Id",
                column: "LEAVEBALANCE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Employee",
                column: "LEAVEBALANCE_EMPLOYEE",
                type: "INTEGER",
            },
            {
                name: "Year",
                column: "LEAVEBALANCE_YEAR",
                type: "VARCHAR",
            },
            {
                name: "Type",
                column: "LEAVEBALANCE_TYPE",
                type: "INTEGER",
            },
            {
                name: "Granted",
                column: "LEAVEBALANCE_GRANTED",
                type: "INTEGER",
            },
            {
                name: "Used",
                column: "LEAVEBALANCE_USED",
                type: "INTEGER",
            },
            {
                name: "Balance",
                column: "LEAVEBALANCE_BALANCE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveBalanceRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveBalanceEntityOptions): LeaveBalanceEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeaveBalanceEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeaveBalanceCreateEntity): number {
        // @ts-ignore
        (entity as LeaveBalanceEntity).Balance = entity['Granted'] - entity['Used'];
        if (entity.Granted === undefined || entity.Granted === null) {
            (entity as LeaveBalanceEntity).Granted = 0;
        }
        if (entity.Used === undefined || entity.Used === null) {
            (entity as LeaveBalanceEntity).Used = 0;
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVEBALANCE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEBALANCE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveBalanceUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVEBALANCE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVEBALANCE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveBalanceCreateEntity | LeaveBalanceUpdateEntity): number {
        const id = (entity as LeaveBalanceUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveBalanceUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_LEAVEBALANCE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEBALANCE_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveBalanceEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVEBALANCE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveBalanceEntityEvent | LeaveBalanceUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-entities-LeaveBalance", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-entities-LeaveBalance").send(JSON.stringify(data));
    }
}
