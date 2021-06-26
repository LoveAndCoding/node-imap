export const RE_INTEGER = /^\d+$/;
export const RE_PRECEDING = /^(?:\* |A\d+ |\+ ?)/;
export const RE_BODYLITERAL = /BODY\[(.*)\] \{(\d+)\}$/i;
export const RE_BODYINLINEKEY = /^BODY\[(.*)\]$/i;
export const RE_SEQNO = /^\* (\d+)/;
export const RE_LISTCONTENT = /^\((.*)\)$/;
export const RE_LITERAL = /\{(\d+)\}$/;
export const RE_UNTAGGED = /^\* (?:(OK|NO|BAD|BYE|FLAGS|ID|LIST|XLIST|LSUB|SEARCH|STATUS|CAPABILITY|NAMESPACE|PREAUTH|SORT|THREAD|ESEARCH|QUOTA|QUOTAROOT)|(\d+) (EXPUNGE|FETCH|RECENT|EXISTS))(?:(?: \[([^\]]+)\])?(?: (.+))?)?$/i;
export const RE_TAGGED = /^A(\d+) (OK|NO|BAD) ?(?:\[([^\]]+)\] )?(.*)$/i;
export const RE_CRLF = /\r\n/g;
export const RE_HDR = /^([^:]+):[ \t]?(.+)?$/;
export const RE_ENCWORD = /=\?([^?*]*?)(?:\*.*?)?\?([qb])\?(.*?)\?=/gi;
export const RE_ENCWORD_END = /=\?([^?*]*?)(?:\*.*?)?\?([qb])\?(.*?)\?=$/i;
export const RE_ENCWORD_BEGIN = /^[ \t]=\?([^?*]*?)(?:\*.*?)?\?([qb])\?(.*?)\?=/i;
export const RE_QENC = /(?:=([a-fA-F0-9]{2}))|_/g;
export const RE_SEARCH_MODSEQ = /^(.+) \(MODSEQ (.+?)\)$/i;
export const RE_LWS_ONLY = /^[ \t]*$/;
