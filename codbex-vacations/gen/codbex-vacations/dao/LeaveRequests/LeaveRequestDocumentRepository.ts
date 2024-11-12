import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface LeaveRequestDocumentEntity {
    readonly Id: number;
    LeaveRequest?: number;
    Document?: string;
}

export interface LeaveRequestDocumentCreateEntity {
    readonly LeaveRequest?: number;
    readonly Document?: string;
}

export interface LeaveRequestDocumentUpdateEntity extends LeaveRequestDocumentCreateEntity {
    readonly Id: number;
}

export interface LeaveRequestDocumentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            LeaveRequest?: number | number[];
            Document?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            LeaveRequest?: number | number[];
            Document?: string | string[];
        };
        contains?: {
            Id?: number;
            LeaveRequest?: number;
            Document?: string;
        };
        greaterThan?: {
            Id?: number;
            LeaveRequest?: number;
            Document?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            LeaveRequest?: number;
            Document?: string;
        };
        lessThan?: {
            Id?: number;
            LeaveRequest?: number;
            Document?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            LeaveRequest?: number;
            Document?: string;
        };
    },
    $select?: (keyof LeaveRequestDocumentEntity)[],
    $sort?: string | (keyof LeaveRequestDocumentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface LeaveRequestDocumentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<LeaveRequestDocumentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface LeaveRequestDocumentUpdateEntityEvent extends LeaveRequestDocumentEntityEvent {
    readonly previousEntity: LeaveRequestDocumentEntity;
}

export class LeaveRequestDocumentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_LEAVEREQUESTDOCUMENT",
        properties: [
            {
                name: "Id",
                column: "LEAVEREQUESTDOCUMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "LeaveRequest",
                column: "LEAVEREQUESTDOCUMENT_LEAVEREQUEST",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "LEAVEREQUESTDOCUMENT_DOCUMENT",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(LeaveRequestDocumentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: LeaveRequestDocumentEntityOptions): LeaveRequestDocumentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): LeaveRequestDocumentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: LeaveRequestDocumentCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_LEAVEREQUESTDOCUMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEREQUESTDOCUMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: LeaveRequestDocumentUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_LEAVEREQUESTDOCUMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "LEAVEREQUESTDOCUMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: LeaveRequestDocumentCreateEntity | LeaveRequestDocumentUpdateEntity): number {
        const id = (entity as LeaveRequestDocumentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as LeaveRequestDocumentUpdateEntity);
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
            table: "CODBEX_LEAVEREQUESTDOCUMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "LEAVEREQUESTDOCUMENT_ID",
                value: id
            }
        });
    }

    public count(options?: LeaveRequestDocumentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_LEAVEREQUESTDOCUMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: LeaveRequestDocumentEntityEvent | LeaveRequestDocumentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-vacations-LeaveRequests-LeaveRequestDocument", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-vacations-LeaveRequests-LeaveRequestDocument").send(JSON.stringify(data));
    }
}
