import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeaveStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface LeaveStatusCreateEntity {
    readonly Name?: string;
}

export interface LeaveStatusUpdateEntity extends LeaveStatusCreateEntity {
    readonly Id: number;
}

export interface LeaveStatusEntityOptions {
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
    $select?: (keyof LeaveStatusEntity)[],
    $sort?: string | (keyof LeaveStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveStatusUpdateEntityEvent extends LeaveStatusEntityEvent {
    readonly previousEntity: LeaveStatusEntity;
}

export class LeaveStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVESTATUS",
        properties: [
            {
                name: "Id",
                column: "LEAVESTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "LEAVESTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveStatusEntityOptions): LeaveStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeaveStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeaveStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVESTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVESTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVESTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveStatusCreateEntity | LeaveStatusUpdateEntity): number {
        const id = (entity as LeaveStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveStatusUpdateEntity);
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
            table: "CODBEX_LEAVESTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVESTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVESTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveStatusEntityEvent | LeaveStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-Settings-LeaveStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-Settings-LeaveStatus").send(JSON.stringify(data));
    }
}
