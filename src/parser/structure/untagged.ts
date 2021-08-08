import { OperatorToken } from "../../lexer/tokens";
import { ParsingError } from "../../errors";
import { LexerTokenList, TokenTypes } from "../../lexer/types";
import { CapabilityList } from "./capability";
import { Expunge } from "./expunge";
import { Fetch } from "./fetch";
import { IDResponse } from "./id";
import * as MailboxData from "./mailbox";
import { NamespaceResponse } from "./namespace";
import { SortResponse } from "./sort";
import { StatusResponse } from "./status";

type ContentType =
	| CapabilityList
	| Expunge
	| IDResponse
	| NamespaceResponse
	| SortResponse
	| StatusResponse
	| MailboxData.ContentType;

// From spec:
// response-data   = "*" SP (resp-cond-state / resp-cond-bye /
//                   mailbox-data / message-data / capability-data) CRLF
//
// Each of those sub items is handled by another structure, so this is
// simply our wrapper
//   StatusResponse     === resp-cond-state / resp-cond-bye
//   MailboxData.*      === mailbox-data
//   CapabilityResponse === capability-data
//   Expunge            === message-data.Expunge
export default class UntaggedResponse {
	public readonly content: ContentType;
	public readonly type: string;

	constructor(tokens: LexerTokenList) {
		const firstToken = tokens[0];
		const secondToken = tokens[1];
		if (
			!firstToken ||
			!(firstToken instanceof OperatorToken) ||
			firstToken.getTrueValue() !== "*" ||
			!secondToken.isType(TokenTypes.space)
		) {
			throw new ParsingError(
				"Instantiating UntaggedResponse with a response of the wrong format",
				tokens,
			);
		}

		// Content starts after "*" and SP characters
		const contentTokens = tokens.slice(2);
		const contentTypeToken = contentTokens[0];

		if (contentTypeToken.isType(TokenTypes.atom)) {
			// We have an Atom token, which means we want to search for
			// the matching command for that atom
			this.type = contentTypeToken.getTrueValue();

			const toCheckList = [
				StatusResponse,
				CapabilityList,
				IDResponse,
				NamespaceResponse,
				SortResponse,
				MailboxData, // See below for Exists/Recent
			] as const;
			for (const check of toCheckList) {
				this.content = check.match(contentTokens);
				if (this.content) {
					if ("commandType" in check) {
						this.type = check.commandType;
					}
					break;
				}
			}
		} else if (contentTypeToken.isType(TokenTypes.number)) {
			// The content type token indicates we've got a number first,
			// which matches another set of response types
			const toCheckList = [
				MailboxData.ExistsCount,
				Expunge,
				Fetch,
				MailboxData.RecentCount,
			];
			for (const check of toCheckList) {
				this.content = check.match(contentTokens);
				if (this.content) {
					this.type = check.commandType;
					break;
				}
			}
		}

		if (!this.content) {
			throw new ParsingError(
				`Parsing for response is not yet supported`,
				tokens,
			);
		}
	}
}
