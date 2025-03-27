import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeaveTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeaveTypeCreateEntity {
    readonly Name?: string;
}

export interface LeaveTypeUpdateEntity extends LeaveTypeCreateEntity {
    readonly Id: number;
}

export interface LeaveTypeEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof LeaveTypeEntity)[],
    $sort?: string | (keyof LeaveTypeEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveTypeUpdateEntityEvent extends LeaveTypeEntityEvent {
    readonly previousEntity: LeaveTypeEntity;
}

export class LeaveTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVETYPE",
        properties: [
            {
                name: "Id",
                column: "LEAVETYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEAVETYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveTypeRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveTypeEntityOptions): LeaveTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeaveTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeaveTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVETYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVETYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVETYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveTypeCreateEntity | LeaveTypeUpdateEntity): number {
        const id = (entity as LeaveTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveTypeUpdateEntity);
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
            table: "CODBEX_LEAVETYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVETYPE_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVETYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveTypeEntityEvent | LeaveTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-Settings-LeaveType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-Settings-LeaveType").send(JSON.stringify(data));
    }
}
