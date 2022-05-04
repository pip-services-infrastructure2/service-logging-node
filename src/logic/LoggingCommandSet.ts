import { CommandSet } from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { ArraySchema } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';
import { DateTimeConverter } from 'pip-services3-commons-nodex';
import { LogLevelConverter } from 'pip-services3-components-nodex';

import { LogMessageV1Schema } from '../data/version1/LogMessageV1Schema';
import { ILoggingController } from './ILoggingController';

export class LoggingCommandSet extends CommandSet {
	private _logic: ILoggingController;

	constructor(logic: ILoggingController) {
		super();

		this._logic = logic;

		this.addCommand(this.makeReadMessagesCommand());
		this.addCommand(this.makeReadErrorsCommand());
		this.addCommand(this.makeWriteMessageCommand());
		this.addCommand(this.makeWriteMessagesCommand());
		this.addCommand(this.makeClearCommand());
	}

	private makeReadMessagesCommand(): ICommand {
		return new Command(
			"read_messages",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			async (correlationId: string, args: Parameters) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				return await this._logic.readMessages(correlationId, filter, paging);
			}
		);
	}

	private makeReadErrorsCommand(): ICommand {
		return new Command(
			"read_errors",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
			async (correlationId: string, args: Parameters) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				return await this._logic.readErrors(correlationId, filter, paging);
			}
		);
	}

	private makeWriteMessageCommand(): ICommand {
		return new Command(
			"write_message",
			new ObjectSchema(true)
				.withRequiredProperty('message', new LogMessageV1Schema()),
			async (correlationId: string, args: Parameters) => {
				let message = args.get("message");
				message.level = LogLevelConverter.toLogLevel(message.level);
				message.time = DateTimeConverter.toNullableDateTime(message.time);
				return await this._logic.writeMessage(correlationId, message);
			}
		);
	}

	private makeWriteMessagesCommand(): ICommand {
		return new Command(
			"write_messages",
			new ObjectSchema(true)
				.withRequiredProperty('messages', new ArraySchema(new LogMessageV1Schema())),
			async (correlationId: string, args: Parameters) => {
				let messages = args.get("messages");
				for (let message of messages)
					message.time = DateTimeConverter.toNullableDateTime(message.time);
				return await this._logic.writeMessages(correlationId, messages);
			}
		);
	}

	private makeClearCommand(): ICommand {
		return new Command(
			"clear",
			null,
			async (correlationId: string, args: Parameters) => {
				return await this._logic.clear(correlationId);
			}
		);
	}

}