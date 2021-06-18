// Simple Spec
//
// This file contains a set of simple commands and their expected results
// for running tests with. These commands should generally result in basic
// and predictable parsing and lexing results that can be easily reasoned
// by simply reading the input
//
// Many of these examples are pulled directly from the IMAP specification.
import {
	CRLF,
	// Helper FNs
	atom,
	qString,
	op,
	num,
	// Premade tokens
	tokenCRLF,
	tokenCloseBrack,
	tokenCloseParen,
	tokenNil,
	tokenOpenBrack,
	tokenOpenParen,
	tokenPlus,
	tokenSP,
	tokenStar,
} from "./constants";
import { TestSpec } from "./types";

// And finally, build our set of test specs
const simpleSet: TestSpec[] = [
	{
		name: "Tagged OK",
		input: ["A1 OK LOGIN completed", CRLF].join(""),
		results: {
			lexer: [
				atom("A1"),
				tokenSP,
				atom("OK"),
				tokenSP,
				atom("LOGIN"),
				tokenSP,
				atom("completed"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Continuation",
		input: ["+ idling", CRLF].join(""),
		results: {
			lexer: [tokenPlus, tokenSP, atom("idling"), tokenCRLF],
		},
	},
	{
		name: "Continuation with text code",
		input: ["+ [ALERT] idling", CRLF].join(""),
		results: {
			lexer: [
				tokenPlus,
				tokenSP,
				tokenOpenBrack,
				atom("ALERT"),
				tokenCloseBrack,
				tokenSP,
				atom("idling"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Multiple namespaces",
		input: [
			"* NAMESPACE ",
			'(("" "/")) ',
			'(("~" "/")) ',
			'(("#shared/" "/")("#public/" "/")("#ftp/" "/")("#news." "."))',
			CRLF,
		].join(""),
		results: {
			lexer: [
				// '* NAMESPACE '
				tokenStar,
				tokenSP,
				atom("NAMESPACE"),
				tokenSP,
				// '(("" "/")) '
				tokenOpenParen,
				tokenOpenParen,
				qString(""),
				tokenSP,
				qString("/"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				// '(("~" "/")) '
				tokenOpenParen,
				tokenOpenParen,
				qString("~"),
				tokenSP,
				qString("/"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				// '(("#shared/" "/")("#public/" "/")("#ftp/" "/")("#news." "."))'
				tokenOpenParen,
				tokenOpenParen,
				qString("#shared/"),
				tokenSP,
				qString("/"),
				tokenCloseParen,
				tokenOpenParen,
				qString("#public/"),
				tokenSP,
				qString("/"),
				tokenCloseParen,
				tokenOpenParen,
				qString("#ftp/"),
				tokenSP,
				qString("/"),
				tokenCloseParen,
				tokenOpenParen,
				qString("#news."),
				tokenSP,
				qString("."),
				tokenCloseParen,
				tokenCloseParen,
				tokenCRLF,
			],
		},
	},
	{
		name: "Multiple namespaces (NIL Variant)",
		input: [
			"* NAMESPACE ",
			'(("" "/" "X-PARAM" ("FLAG1" "FLAG2"))) ',
			"NIL ",
			"NIL",
			CRLF,
		].join(""),
		results: {
			lexer: [
				// '* NAMESPACE '
				tokenStar,
				tokenSP,
				atom("NAMESPACE"),
				tokenSP,
				// '(("" "/" "X-PARAM" ("FLAG1" "FLAG2"))) '
				tokenOpenParen,
				tokenOpenParen,
				qString(""),
				tokenSP,
				qString("/"),
				tokenSP,
				qString("X-PARAM"),
				tokenSP,
				tokenOpenParen,
				qString("FLAG1"),
				tokenSP,
				qString("FLAG2"),
				tokenCloseParen,
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				// 'NIL '
				tokenNil,
				tokenSP,
				// 'NIL'
				tokenNil,
				tokenCRLF,
			],
		},
	},
	{
		name: "Flags",
		input: [
			"* FLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft)",
			CRLF,
		].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("FLAGS"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Answered"),
				tokenSP,
				op("\\"),
				atom("Flagged"),
				tokenSP,
				op("\\"),
				atom("Deleted"),
				tokenSP,
				op("\\"),
				atom("Seen"),
				tokenSP,
				op("\\"),
				atom("Draft"),
				tokenCloseParen,
				tokenCRLF,
			],
		},
	},
	{
		name: "Search",
		input: ["* SEARCH 2 3 6", CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("SEARCH"),
				tokenSP,
				num(2),
				tokenSP,
				num(3),
				tokenSP,
				num(6),
				tokenCRLF,
			],
		},
	},
	{
		name: "XLIST",
		input: ['* XLIST (\\Noselect) "/" ~/Mail/foo', CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("XLIST"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Noselect"),
				tokenCloseParen,
				tokenSP,
				qString("/"),
				tokenSP,
				atom("~/Mail/foo"),
				tokenCRLF,
			],
		},
	},
	{
		name: "LIST",
		input: ['* LIST (\\Noselect) "/" ~/Mail/foo', CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("LIST"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Noselect"),
				tokenCloseParen,
				tokenSP,
				qString("/"),
				tokenSP,
				atom("~/Mail/foo"),
				tokenCRLF,
			],
		},
	},
	{
		name: "STATUS",
		input: ["* STATUS blurdybloop (MESSAGES 231 UIDNEXT 44292)", CRLF].join(
			"",
		),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("STATUS"),
				tokenSP,
				atom("blurdybloop"),
				tokenSP,
				tokenOpenParen,
				atom("MESSAGES"),
				tokenSP,
				num(231),
				tokenSP,
				atom("UIDNEXT"),
				tokenSP,
				num(44292),
				tokenCloseParen,
				tokenCRLF,
			],
		},
	},
	{
		name: "Untagged OK (with text code, with text)",
		input: [
			"* OK [UNSEEN 17] Message 17 is the first unseen message",
			CRLF,
		].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("OK"),
				tokenSP,
				tokenOpenBrack,
				atom("UNSEEN"),
				tokenSP,
				num(17),
				tokenCloseBrack,
				tokenSP,
				atom("Message"),
				tokenSP,
				num(17),
				tokenSP,
				atom("is"),
				tokenSP,
				atom("the"),
				tokenSP,
				atom("first"),
				tokenSP,
				atom("unseen"),
				tokenSP,
				atom("message"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Untagged OK (with array text code, with text)",
		input: [
			"* OK [PERMANENTFLAGS (\\Deleted \\Seen \\*)] Limited",
			CRLF,
		].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("OK"),
				tokenSP,
				tokenOpenBrack,
				atom("PERMANENTFLAGS"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Deleted"),
				tokenSP,
				op("\\"),
				atom("Seen"),
				tokenSP,
				op("\\"),
				op("*"),
				tokenCloseParen,
				tokenCloseBrack,
				tokenSP,
				atom("Limited"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Untagged OK (no text code, with text)",
		input: ["* OK IMAP4rev1 Service Ready", CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				atom("OK"),
				tokenSP,
				atom("IMAP4rev1"),
				tokenSP,
				atom("Service"),
				tokenSP,
				atom("Ready"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Untagged EXISTS",
		input: ["* 18 EXISTS", CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				num(18),
				tokenSP,
				atom("EXISTS"),
				tokenCRLF,
			],
		},
	},
	{
		name: "Untagged RECENT",
		input: ["* 2 RECENT", CRLF].join(""),
		results: {
			lexer: [
				tokenStar,
				tokenSP,
				num(2),
				tokenSP,
				atom("RECENT"),
				tokenCRLF,
			],
		},
	},
];

export default simpleSet;