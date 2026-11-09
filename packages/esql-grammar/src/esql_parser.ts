// @ts-nocheck
// Generated from src/esql_parser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import esql_parserListener from "./esql_parserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { EsqlCapabilities } from './esql_capabilities.js';

import parser_config from './parser_config.js';

export default class esql_parser extends parser_config {
	public static readonly LINE_COMMENT = 1;
	public static readonly MULTILINE_COMMENT = 2;
	public static readonly WS = 3;
	public static readonly CHANGE_POINT = 4;
	public static readonly DEDUP = 5;
	public static readonly DENSE_VECTOR = 6;
	public static readonly ENRICH = 7;
	public static readonly DEV_EXPLAIN = 8;
	public static readonly COMPLETION = 9;
	public static readonly DISSECT = 10;
	public static readonly EVAL = 11;
	public static readonly GROK = 12;
	public static readonly LIMIT = 13;
	public static readonly RERANK = 14;
	public static readonly ROW = 15;
	public static readonly SAMPLE = 16;
	public static readonly SORT = 17;
	public static readonly STATS = 18;
	public static readonly WHERE = 19;
	public static readonly URI_PARTS = 20;
	public static readonly METRICS_INFO = 21;
	public static readonly REGISTERED_DOMAIN = 22;
	public static readonly TS_INFO = 23;
	public static readonly USER_AGENT = 24;
	public static readonly TS_COLLAPSE = 25;
	public static readonly IP_LOCATION = 26;
	public static readonly DEV_DESCRIBE = 27;
	public static readonly DEV_FILLNULL = 28;
	public static readonly FROM = 29;
	public static readonly TS = 30;
	public static readonly DEV_EXTERNAL = 31;
	public static readonly FORK = 32;
	public static readonly DEV_LET = 33;
	public static readonly FUSE = 34;
	public static readonly HIGHLIGHT = 35;
	public static readonly INLINE = 36;
	public static readonly INLINESTATS = 37;
	public static readonly JOIN_LOOKUP = 38;
	public static readonly DEV_JOIN_FULL = 39;
	public static readonly DEV_JOIN_LEFT = 40;
	public static readonly DEV_JOIN_RIGHT = 41;
	public static readonly DEV_LOOKUP = 42;
	public static readonly MMR = 43;
	public static readonly MV_EXPAND = 44;
	public static readonly DROP = 45;
	public static readonly KEEP = 46;
	public static readonly PROMQL = 47;
	public static readonly RENAME = 48;
	public static readonly SET = 49;
	public static readonly SHOW = 50;
	public static readonly UNKNOWN_CMD = 51;
	public static readonly CHANGE_POINT_LINE_COMMENT = 52;
	public static readonly CHANGE_POINT_MULTILINE_COMMENT = 53;
	public static readonly CHANGE_POINT_WS = 54;
	public static readonly ENRICH_POLICY_NAME = 55;
	public static readonly ENRICH_LINE_COMMENT = 56;
	public static readonly ENRICH_MULTILINE_COMMENT = 57;
	public static readonly ENRICH_WS = 58;
	public static readonly ENRICH_FIELD_LINE_COMMENT = 59;
	public static readonly ENRICH_FIELD_MULTILINE_COMMENT = 60;
	public static readonly ENRICH_FIELD_WS = 61;
	public static readonly EXPLAIN_WS = 62;
	public static readonly EXPLAIN_LINE_COMMENT = 63;
	public static readonly EXPLAIN_MULTILINE_COMMENT = 64;
	public static readonly PIPE = 65;
	public static readonly QUOTED_STRING = 66;
	public static readonly INTEGER_LITERAL = 67;
	public static readonly DECIMAL_LITERAL = 68;
	public static readonly AND = 69;
	public static readonly ASC = 70;
	public static readonly ASSIGN = 71;
	public static readonly BY = 72;
	public static readonly CAST_OP = 73;
	public static readonly COLON = 74;
	public static readonly SEMICOLON = 75;
	public static readonly COMMA = 76;
	public static readonly DESC = 77;
	public static readonly DOT = 78;
	public static readonly FALSE = 79;
	public static readonly FIRST = 80;
	public static readonly IN = 81;
	public static readonly IS = 82;
	public static readonly LAST = 83;
	public static readonly LIKE = 84;
	public static readonly NOT = 85;
	public static readonly NULL = 86;
	public static readonly NULLS = 87;
	public static readonly ON = 88;
	public static readonly OR = 89;
	public static readonly PARAM = 90;
	public static readonly RLIKE = 91;
	public static readonly TRUE = 92;
	public static readonly WITH = 93;
	public static readonly EQ = 94;
	public static readonly CIEQ = 95;
	public static readonly NEQ = 96;
	public static readonly LT = 97;
	public static readonly LTE = 98;
	public static readonly GT = 99;
	public static readonly GTE = 100;
	public static readonly PLUS = 101;
	public static readonly MINUS = 102;
	public static readonly ASTERISK = 103;
	public static readonly SLASH = 104;
	public static readonly PERCENT = 105;
	public static readonly LEFT_BRACES = 106;
	public static readonly RIGHT_BRACES = 107;
	public static readonly ARROW = 108;
	public static readonly DOUBLE_PARAMS = 109;
	public static readonly NAMED_OR_POSITIONAL_PARAM = 110;
	public static readonly NAMED_OR_POSITIONAL_DOUBLE_PARAMS = 111;
	public static readonly OPENING_BRACKET = 112;
	public static readonly CLOSING_BRACKET = 113;
	public static readonly LP = 114;
	public static readonly RP = 115;
	public static readonly UNQUOTED_IDENTIFIER = 116;
	public static readonly QUOTED_IDENTIFIER = 117;
	public static readonly EXPR_LINE_COMMENT = 118;
	public static readonly EXPR_MULTILINE_COMMENT = 119;
	public static readonly EXPR_WS = 120;
	public static readonly DEFAULT = 121;
	public static readonly FILLNULL_LINE_COMMENT = 122;
	public static readonly FILLNULL_MULTILINE_COMMENT = 123;
	public static readonly FILLNULL_WS = 124;
	public static readonly METADATA = 125;
	public static readonly UNQUOTED_SOURCE = 126;
	public static readonly FROM_LINE_COMMENT = 127;
	public static readonly FROM_MULTILINE_COMMENT = 128;
	public static readonly FROM_WS = 129;
	public static readonly FORK_WS = 130;
	public static readonly FORK_LINE_COMMENT = 131;
	public static readonly FORK_MULTILINE_COMMENT = 132;
	public static readonly LET_LINE_COMMENT = 133;
	public static readonly LET_MULTILINE_COMMENT = 134;
	public static readonly LET_WS = 135;
	public static readonly GROUP = 136;
	public static readonly SCORE = 137;
	public static readonly KEY = 138;
	public static readonly FUSE_LINE_COMMENT = 139;
	public static readonly FUSE_MULTILINE_COMMENT = 140;
	public static readonly FUSE_WS = 141;
	public static readonly INLINE_STATS = 142;
	public static readonly INLINE_LINE_COMMENT = 143;
	public static readonly INLINE_MULTILINE_COMMENT = 144;
	public static readonly INLINE_WS = 145;
	public static readonly AFTER_IN_LINE_COMMENT = 146;
	public static readonly AFTER_IN_MULTILINE_COMMENT = 147;
	public static readonly AFTER_IN_WS = 148;
	public static readonly IN_EXPR_FALLBACK = 149;
	public static readonly JOIN = 150;
	public static readonly USING = 151;
	public static readonly JOIN_LINE_COMMENT = 152;
	public static readonly JOIN_MULTILINE_COMMENT = 153;
	public static readonly JOIN_WS = 154;
	public static readonly LOOKUP_LINE_COMMENT = 155;
	public static readonly LOOKUP_MULTILINE_COMMENT = 156;
	public static readonly LOOKUP_WS = 157;
	public static readonly LOOKUP_FIELD_LINE_COMMENT = 158;
	public static readonly LOOKUP_FIELD_MULTILINE_COMMENT = 159;
	public static readonly LOOKUP_FIELD_WS = 160;
	public static readonly MMR_LIMIT = 161;
	public static readonly MMR_LINE_COMMENT = 162;
	public static readonly MMR_MULTILINE_COMMENT = 163;
	public static readonly MMR_WS = 164;
	public static readonly MVEXPAND_LINE_COMMENT = 165;
	public static readonly MVEXPAND_MULTILINE_COMMENT = 166;
	public static readonly MVEXPAND_WS = 167;
	public static readonly ID_PATTERN = 168;
	public static readonly PROJECT_LINE_COMMENT = 169;
	public static readonly PROJECT_MULTILINE_COMMENT = 170;
	public static readonly PROJECT_WS = 171;
	public static readonly PROMQL_PARAMS_LINE_COMMENT = 172;
	public static readonly PROMQL_PARAMS_MULTILINE_COMMENT = 173;
	public static readonly PROMQL_PARAMS_WS = 174;
	public static readonly PROMQL_QUERY_COMMENT = 175;
	public static readonly PROMQL_SINGLE_QUOTED_STRING = 176;
	public static readonly PROMQL_OTHER_QUERY_CONTENT = 177;
	public static readonly AS = 178;
	public static readonly RENAME_LINE_COMMENT = 179;
	public static readonly RENAME_MULTILINE_COMMENT = 180;
	public static readonly RENAME_WS = 181;
	public static readonly SET_LINE_COMMENT = 182;
	public static readonly SET_MULTILINE_COMMENT = 183;
	public static readonly SET_WS = 184;
	public static readonly INFO = 185;
	public static readonly SHOW_LINE_COMMENT = 186;
	public static readonly SHOW_MULTILINE_COMMENT = 187;
	public static readonly SHOW_WS = 188;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_statements = 0;
	public static readonly RULE_singleStatement = 1;
	public static readonly RULE_query = 2;
	public static readonly RULE_sourceCommand = 3;
	public static readonly RULE_processingCommand = 4;
	public static readonly RULE_whereCommand = 5;
	public static readonly RULE_dataType = 6;
	public static readonly RULE_rowCommand = 7;
	public static readonly RULE_fields = 8;
	public static readonly RULE_field = 9;
	public static readonly RULE_fromCommand = 10;
	public static readonly RULE_timeSeriesCommand = 11;
	public static readonly RULE_externalCommand = 12;
	public static readonly RULE_indexPatternAndMetadataFields = 13;
	public static readonly RULE_indexPatternOrSubquery = 14;
	public static readonly RULE_subquery = 15;
	public static readonly RULE_subquerySourceCommand = 16;
	public static readonly RULE_indexPattern = 17;
	public static readonly RULE_clusterString = 18;
	public static readonly RULE_selectorString = 19;
	public static readonly RULE_unquotedIndexString = 20;
	public static readonly RULE_indexString = 21;
	public static readonly RULE_metadata = 22;
	public static readonly RULE_evalCommand = 23;
	public static readonly RULE_statsCommand = 24;
	public static readonly RULE_aggFields = 25;
	public static readonly RULE_aggField = 26;
	public static readonly RULE_qualifiedName = 27;
	public static readonly RULE_fieldName = 28;
	public static readonly RULE_qualifiedNamePattern = 29;
	public static readonly RULE_fieldNamePattern = 30;
	public static readonly RULE_qualifiedNamePatterns = 31;
	public static readonly RULE_identifier = 32;
	public static readonly RULE_identifierPattern = 33;
	public static readonly RULE_expressionModeIdentifierPattern = 34;
	public static readonly RULE_parameter = 35;
	public static readonly RULE_doubleParameter = 36;
	public static readonly RULE_identifierOrParameter = 37;
	public static readonly RULE_stringOrParameter = 38;
	public static readonly RULE_limitCommand = 39;
	public static readonly RULE_limitByGroupKey = 40;
	public static readonly RULE_sortCommand = 41;
	public static readonly RULE_orderExpression = 42;
	public static readonly RULE_keepCommand = 43;
	public static readonly RULE_dropCommand = 44;
	public static readonly RULE_renameCommand = 45;
	public static readonly RULE_renameClause = 46;
	public static readonly RULE_dissectCommand = 47;
	public static readonly RULE_dissectCommandOptions = 48;
	public static readonly RULE_dissectCommandOption = 49;
	public static readonly RULE_commandNamedParameters = 50;
	public static readonly RULE_grokCommand = 51;
	public static readonly RULE_mvExpandCommand = 52;
	public static readonly RULE_explainCommand = 53;
	public static readonly RULE_subqueryExpression = 54;
	public static readonly RULE_showCommand = 55;
	public static readonly RULE_enrichCommand = 56;
	public static readonly RULE_enrichPolicyName = 57;
	public static readonly RULE_enrichWithClause = 58;
	public static readonly RULE_sampleCommand = 59;
	public static readonly RULE_changePointCommand = 60;
	public static readonly RULE_forkCommand = 61;
	public static readonly RULE_forkSubQueries = 62;
	public static readonly RULE_forkSubQuery = 63;
	public static readonly RULE_forkSubQueryCommand = 64;
	public static readonly RULE_forkSubQueryProcessingCommand = 65;
	public static readonly RULE_rerankCommand = 66;
	public static readonly RULE_completionCommand = 67;
	public static readonly RULE_inlineStatsCommand = 68;
	public static readonly RULE_fuseCommand = 69;
	public static readonly RULE_fuseConfiguration = 70;
	public static readonly RULE_fuseKeyByFields = 71;
	public static readonly RULE_metricsInfoCommand = 72;
	public static readonly RULE_tsInfoCommand = 73;
	public static readonly RULE_tsCollapseCommand = 74;
	public static readonly RULE_describeCommand = 75;
	public static readonly RULE_lookupCommand = 76;
	public static readonly RULE_dedupCommand = 77;
	public static readonly RULE_highlightCommand = 78;
	public static readonly RULE_qualifiedNames = 79;
	public static readonly RULE_fillNullCommand = 80;
	public static readonly RULE_fillNullValue = 81;
	public static readonly RULE_uriPartsCommand = 82;
	public static readonly RULE_registeredDomainCommand = 83;
	public static readonly RULE_userAgentCommand = 84;
	public static readonly RULE_ipLocationCommand = 85;
	public static readonly RULE_setCommand = 86;
	public static readonly RULE_setField = 87;
	public static readonly RULE_letCommand = 88;
	public static readonly RULE_letBinding = 89;
	public static readonly RULE_mmrCommand = 90;
	public static readonly RULE_mmrQueryVectorParams = 91;
	public static readonly RULE_denseVectorCommand = 92;
	public static readonly RULE_denseVectorNaming = 93;
	public static readonly RULE_booleanExpression = 94;
	public static readonly RULE_regexBooleanExpression = 95;
	public static readonly RULE_matchBooleanExpression = 96;
	public static readonly RULE_valueExpression = 97;
	public static readonly RULE_operatorExpression = 98;
	public static readonly RULE_primaryExpression = 99;
	public static readonly RULE_functionExpression = 100;
	public static readonly RULE_functionName = 101;
	public static readonly RULE_lambda = 102;
	public static readonly RULE_mapExpression = 103;
	public static readonly RULE_entryExpression = 104;
	public static readonly RULE_mapValue = 105;
	public static readonly RULE_constant = 106;
	public static readonly RULE_booleanValue = 107;
	public static readonly RULE_numericValue = 108;
	public static readonly RULE_decimalValue = 109;
	public static readonly RULE_integerValue = 110;
	public static readonly RULE_string = 111;
	public static readonly RULE_comparisonOperator = 112;
	public static readonly RULE_joinCommand = 113;
	public static readonly RULE_joinTarget = 114;
	public static readonly RULE_joinCondition = 115;
	public static readonly RULE_promqlCommand = 116;
	public static readonly RULE_valueName = 117;
	public static readonly RULE_promqlParam = 118;
	public static readonly RULE_promqlParamName = 119;
	public static readonly RULE_promqlParamValue = 120;
	public static readonly RULE_promqlQueryContent = 121;
	public static readonly RULE_promqlQueryPart = 122;
	public static readonly RULE_promqlIndexPattern = 123;
	public static readonly RULE_promqlClusterString = 124;
	public static readonly RULE_promqlSelectorString = 125;
	public static readonly RULE_promqlUnquotedIndexString = 126;
	public static readonly RULE_promqlIndexString = 127;
	public static readonly literalNames: (string | null)[] = [ null, null, 
                                                            null, null, 
                                                            "'change_point'", 
                                                            "'dedup'", "'dense_vector'", 
                                                            "'enrich'", 
                                                            "'explain'", 
                                                            "'completion'", 
                                                            "'dissect'", 
                                                            "'eval'", "'grok'", 
                                                            "'limit'", "'rerank'", 
                                                            "'row'", "'sample'", 
                                                            "'sort'", null, 
                                                            "'where'", "'uri_parts'", 
                                                            "'metrics_info'", 
                                                            "'registered_domain'", 
                                                            "'ts_info'", 
                                                            "'user_agent'", 
                                                            "'ts_collapse'", 
                                                            "'ip_location'", 
                                                            "'describe'", 
                                                            "'fillnull'", 
                                                            "'from'", "'ts'", 
                                                            null, "'fork'", 
                                                            "'let'", "'fuse'", 
                                                            "'highlight'", 
                                                            "'inline'", 
                                                            "'inlinestats'", 
                                                            "'lookup'", 
                                                            "'full'", "'left'", 
                                                            "'right'", "'lookup_\uD83Dí°”'", 
                                                            "'mmr'", "'mv_expand'", 
                                                            "'drop'", "'keep'", 
                                                            "'promql'", 
                                                            "'rename'", 
                                                            "'set'", "'show'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'|'", null, 
                                                            null, null, 
                                                            "'and'", "'asc'", 
                                                            "'='", "'by'", 
                                                            "'::'", "':'", 
                                                            "';'", "','", 
                                                            "'desc'", "'.'", 
                                                            "'false'", "'first'", 
                                                            "'in'", "'is'", 
                                                            "'last'", "'like'", 
                                                            "'not'", "'null'", 
                                                            "'nulls'", "'on'", 
                                                            "'or'", "'?'", 
                                                            "'rlike'", "'true'", 
                                                            "'with'", "'=='", 
                                                            "'=~'", "'!='", 
                                                            "'<'", "'<='", 
                                                            "'>'", "'>='", 
                                                            "'+'", "'-'", 
                                                            "'*'", "'/'", 
                                                            "'%'", "'{'", 
                                                            "'}'", "'->'", 
                                                            "'??'", null, 
                                                            null, null, 
                                                            "']'", null, 
                                                            "')'", null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'default'", 
                                                            null, null, 
                                                            null, "'metadata'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'group'", "'score'", 
                                                            "'key'", null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'join'", "'USING'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            "'as'", null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'info'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "LINE_COMMENT", 
                                                             "MULTILINE_COMMENT", 
                                                             "WS", "CHANGE_POINT", 
                                                             "DEDUP", "DENSE_VECTOR", 
                                                             "ENRICH", "DEV_EXPLAIN", 
                                                             "COMPLETION", 
                                                             "DISSECT", 
                                                             "EVAL", "GROK", 
                                                             "LIMIT", "RERANK", 
                                                             "ROW", "SAMPLE", 
                                                             "SORT", "STATS", 
                                                             "WHERE", "URI_PARTS", 
                                                             "METRICS_INFO", 
                                                             "REGISTERED_DOMAIN", 
                                                             "TS_INFO", 
                                                             "USER_AGENT", 
                                                             "TS_COLLAPSE", 
                                                             "IP_LOCATION", 
                                                             "DEV_DESCRIBE", 
                                                             "DEV_FILLNULL", 
                                                             "FROM", "TS", 
                                                             "DEV_EXTERNAL", 
                                                             "FORK", "DEV_LET", 
                                                             "FUSE", "HIGHLIGHT", 
                                                             "INLINE", "INLINESTATS", 
                                                             "JOIN_LOOKUP", 
                                                             "DEV_JOIN_FULL", 
                                                             "DEV_JOIN_LEFT", 
                                                             "DEV_JOIN_RIGHT", 
                                                             "DEV_LOOKUP", 
                                                             "MMR", "MV_EXPAND", 
                                                             "DROP", "KEEP", 
                                                             "PROMQL", "RENAME", 
                                                             "SET", "SHOW", 
                                                             "UNKNOWN_CMD", 
                                                             "CHANGE_POINT_LINE_COMMENT", 
                                                             "CHANGE_POINT_MULTILINE_COMMENT", 
                                                             "CHANGE_POINT_WS", 
                                                             "ENRICH_POLICY_NAME", 
                                                             "ENRICH_LINE_COMMENT", 
                                                             "ENRICH_MULTILINE_COMMENT", 
                                                             "ENRICH_WS", 
                                                             "ENRICH_FIELD_LINE_COMMENT", 
                                                             "ENRICH_FIELD_MULTILINE_COMMENT", 
                                                             "ENRICH_FIELD_WS", 
                                                             "EXPLAIN_WS", 
                                                             "EXPLAIN_LINE_COMMENT", 
                                                             "EXPLAIN_MULTILINE_COMMENT", 
                                                             "PIPE", "QUOTED_STRING", 
                                                             "INTEGER_LITERAL", 
                                                             "DECIMAL_LITERAL", 
                                                             "AND", "ASC", 
                                                             "ASSIGN", "BY", 
                                                             "CAST_OP", 
                                                             "COLON", "SEMICOLON", 
                                                             "COMMA", "DESC", 
                                                             "DOT", "FALSE", 
                                                             "FIRST", "IN", 
                                                             "IS", "LAST", 
                                                             "LIKE", "NOT", 
                                                             "NULL", "NULLS", 
                                                             "ON", "OR", 
                                                             "PARAM", "RLIKE", 
                                                             "TRUE", "WITH", 
                                                             "EQ", "CIEQ", 
                                                             "NEQ", "LT", 
                                                             "LTE", "GT", 
                                                             "GTE", "PLUS", 
                                                             "MINUS", "ASTERISK", 
                                                             "SLASH", "PERCENT", 
                                                             "LEFT_BRACES", 
                                                             "RIGHT_BRACES", 
                                                             "ARROW", "DOUBLE_PARAMS", 
                                                             "NAMED_OR_POSITIONAL_PARAM", 
                                                             "NAMED_OR_POSITIONAL_DOUBLE_PARAMS", 
                                                             "OPENING_BRACKET", 
                                                             "CLOSING_BRACKET", 
                                                             "LP", "RP", 
                                                             "UNQUOTED_IDENTIFIER", 
                                                             "QUOTED_IDENTIFIER", 
                                                             "EXPR_LINE_COMMENT", 
                                                             "EXPR_MULTILINE_COMMENT", 
                                                             "EXPR_WS", 
                                                             "DEFAULT", 
                                                             "FILLNULL_LINE_COMMENT", 
                                                             "FILLNULL_MULTILINE_COMMENT", 
                                                             "FILLNULL_WS", 
                                                             "METADATA", 
                                                             "UNQUOTED_SOURCE", 
                                                             "FROM_LINE_COMMENT", 
                                                             "FROM_MULTILINE_COMMENT", 
                                                             "FROM_WS", 
                                                             "FORK_WS", 
                                                             "FORK_LINE_COMMENT", 
                                                             "FORK_MULTILINE_COMMENT", 
                                                             "LET_LINE_COMMENT", 
                                                             "LET_MULTILINE_COMMENT", 
                                                             "LET_WS", "GROUP", 
                                                             "SCORE", "KEY", 
                                                             "FUSE_LINE_COMMENT", 
                                                             "FUSE_MULTILINE_COMMENT", 
                                                             "FUSE_WS", 
                                                             "INLINE_STATS", 
                                                             "INLINE_LINE_COMMENT", 
                                                             "INLINE_MULTILINE_COMMENT", 
                                                             "INLINE_WS", 
                                                             "AFTER_IN_LINE_COMMENT", 
                                                             "AFTER_IN_MULTILINE_COMMENT", 
                                                             "AFTER_IN_WS", 
                                                             "IN_EXPR_FALLBACK", 
                                                             "JOIN", "USING", 
                                                             "JOIN_LINE_COMMENT", 
                                                             "JOIN_MULTILINE_COMMENT", 
                                                             "JOIN_WS", 
                                                             "LOOKUP_LINE_COMMENT", 
                                                             "LOOKUP_MULTILINE_COMMENT", 
                                                             "LOOKUP_WS", 
                                                             "LOOKUP_FIELD_LINE_COMMENT", 
                                                             "LOOKUP_FIELD_MULTILINE_COMMENT", 
                                                             "LOOKUP_FIELD_WS", 
                                                             "MMR_LIMIT", 
                                                             "MMR_LINE_COMMENT", 
                                                             "MMR_MULTILINE_COMMENT", 
                                                             "MMR_WS", "MVEXPAND_LINE_COMMENT", 
                                                             "MVEXPAND_MULTILINE_COMMENT", 
                                                             "MVEXPAND_WS", 
                                                             "ID_PATTERN", 
                                                             "PROJECT_LINE_COMMENT", 
                                                             "PROJECT_MULTILINE_COMMENT", 
                                                             "PROJECT_WS", 
                                                             "PROMQL_PARAMS_LINE_COMMENT", 
                                                             "PROMQL_PARAMS_MULTILINE_COMMENT", 
                                                             "PROMQL_PARAMS_WS", 
                                                             "PROMQL_QUERY_COMMENT", 
                                                             "PROMQL_SINGLE_QUOTED_STRING", 
                                                             "PROMQL_OTHER_QUERY_CONTENT", 
                                                             "AS", "RENAME_LINE_COMMENT", 
                                                             "RENAME_MULTILINE_COMMENT", 
                                                             "RENAME_WS", 
                                                             "SET_LINE_COMMENT", 
                                                             "SET_MULTILINE_COMMENT", 
                                                             "SET_WS", "INFO", 
                                                             "SHOW_LINE_COMMENT", 
                                                             "SHOW_MULTILINE_COMMENT", 
                                                             "SHOW_WS" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"statements", "singleStatement", "query", "sourceCommand", "processingCommand", 
		"whereCommand", "dataType", "rowCommand", "fields", "field", "fromCommand", 
		"timeSeriesCommand", "externalCommand", "indexPatternAndMetadataFields", 
		"indexPatternOrSubquery", "subquery", "subquerySourceCommand", "indexPattern", 
		"clusterString", "selectorString", "unquotedIndexString", "indexString", 
		"metadata", "evalCommand", "statsCommand", "aggFields", "aggField", "qualifiedName", 
		"fieldName", "qualifiedNamePattern", "fieldNamePattern", "qualifiedNamePatterns", 
		"identifier", "identifierPattern", "expressionModeIdentifierPattern", 
		"parameter", "doubleParameter", "identifierOrParameter", "stringOrParameter", 
		"limitCommand", "limitByGroupKey", "sortCommand", "orderExpression", "keepCommand", 
		"dropCommand", "renameCommand", "renameClause", "dissectCommand", "dissectCommandOptions", 
		"dissectCommandOption", "commandNamedParameters", "grokCommand", "mvExpandCommand", 
		"explainCommand", "subqueryExpression", "showCommand", "enrichCommand", 
		"enrichPolicyName", "enrichWithClause", "sampleCommand", "changePointCommand", 
		"forkCommand", "forkSubQueries", "forkSubQuery", "forkSubQueryCommand", 
		"forkSubQueryProcessingCommand", "rerankCommand", "completionCommand", 
		"inlineStatsCommand", "fuseCommand", "fuseConfiguration", "fuseKeyByFields", 
		"metricsInfoCommand", "tsInfoCommand", "tsCollapseCommand", "describeCommand", 
		"lookupCommand", "dedupCommand", "highlightCommand", "qualifiedNames", 
		"fillNullCommand", "fillNullValue", "uriPartsCommand", "registeredDomainCommand", 
		"userAgentCommand", "ipLocationCommand", "setCommand", "setField", "letCommand", 
		"letBinding", "mmrCommand", "mmrQueryVectorParams", "denseVectorCommand", 
		"denseVectorNaming", "booleanExpression", "regexBooleanExpression", "matchBooleanExpression", 
		"valueExpression", "operatorExpression", "primaryExpression", "functionExpression", 
		"functionName", "lambda", "mapExpression", "entryExpression", "mapValue", 
		"constant", "booleanValue", "numericValue", "decimalValue", "integerValue", 
		"string", "comparisonOperator", "joinCommand", "joinTarget", "joinCondition", 
		"promqlCommand", "valueName", "promqlParam", "promqlParamName", "promqlParamValue", 
		"promqlQueryContent", "promqlQueryPart", "promqlIndexPattern", "promqlClusterString", 
		"promqlSelectorString", "promqlUnquotedIndexString", "promqlIndexString",
	];
	public get grammarFileName(): string { return "esql_parser.g4"; }
	public get literalNames(): (string | null)[] { return esql_parser.literalNames; }
	public get symbolicNames(): (string | null)[] { return esql_parser.symbolicNames; }
	public get ruleNames(): string[] { return esql_parser.ruleNames; }
	public get serializedATN(): number[] { return esql_parser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, esql_parser._ATN, esql_parser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public statements(): StatementsContext {
		let localctx: StatementsContext = new StatementsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, esql_parser.RULE_statements);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 259;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 256;
					this.setCommand();
					}
					}
				}
				this.state = 261;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 0, this._ctx);
			}
			this.state = 265;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 262;
					this.letCommand();
					}
					}
				}
				this.state = 267;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			}
			this.state = 268;
			this.singleStatement();
			this.state = 269;
			this.match(esql_parser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public singleStatement(): SingleStatementContext {
		let localctx: SingleStatementContext = new SingleStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, esql_parser.RULE_singleStatement);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 271;
			this.query(0);
			this.state = 272;
			this.match(esql_parser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public query(): QueryContext;
	public query(_p: number): QueryContext;
	// @RuleVersion(0)
	public query(_p?: number): QueryContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: QueryContext = new QueryContext(this, this._ctx, _parentState);
		let _prevctx: QueryContext = localctx;
		let _startState: number = 4;
		this.enterRecursionRule(localctx, 4, esql_parser.RULE_query, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			localctx = new SingleCommandQueryContext(this, localctx);
			this._ctx = localctx;
			_prevctx = localctx;

			this.state = 275;
			this.sourceCommand();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 282;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new CompositeQueryContext(this, new QueryContext(this, _parentctx, _parentState));
					this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_query);
					this.state = 277;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 278;
					this.match(esql_parser.PIPE);
					this.state = 279;
					this.processingCommand();
					}
					}
				}
				this.state = 284;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sourceCommand(): SourceCommandContext {
		let localctx: SourceCommandContext = new SourceCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, esql_parser.RULE_sourceCommand);
		try {
			this.state = 293;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 285;
				this.fromCommand();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 286;
				this.rowCommand();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 287;
				this.showCommand();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 288;
				this.timeSeriesCommand();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 289;
				this.promqlCommand();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 290;
				this.explainCommand();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 291;
				if (!(EsqlCapabilities.Cap.EXTERNAL_COMMAND.isEnabled())) {
					throw this.createFailedPredicateException("EsqlCapabilities.Cap.EXTERNAL_COMMAND.isEnabled()");
				}
				this.state = 292;
				this.externalCommand();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public processingCommand(): ProcessingCommandContext {
		let localctx: ProcessingCommandContext = new ProcessingCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, esql_parser.RULE_processingCommand);
		try {
			this.state = 329;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 11:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 295;
				this.evalCommand();
				}
				break;
			case 19:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 296;
				this.whereCommand();
				}
				break;
			case 46:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 297;
				this.keepCommand();
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 298;
				this.limitCommand();
				}
				break;
			case 18:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 299;
				this.statsCommand();
				}
				break;
			case 17:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 300;
				this.sortCommand();
				}
				break;
			case 45:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 301;
				this.dropCommand();
				}
				break;
			case 48:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 302;
				this.renameCommand();
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 303;
				this.dissectCommand();
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 304;
				this.grokCommand();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 305;
				this.enrichCommand();
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 306;
				this.mvExpandCommand();
				}
				break;
			case 38:
			case 40:
			case 41:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 307;
				this.joinCommand();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 308;
				this.changePointCommand();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 15);
				{
				this.state = 309;
				this.completionCommand();
				}
				break;
			case 16:
				this.enterOuterAlt(localctx, 16);
				{
				this.state = 310;
				this.sampleCommand();
				}
				break;
			case 32:
				this.enterOuterAlt(localctx, 17);
				{
				this.state = 311;
				this.forkCommand();
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 18);
				{
				this.state = 312;
				this.rerankCommand();
				}
				break;
			case 36:
			case 37:
				this.enterOuterAlt(localctx, 19);
				{
				this.state = 313;
				this.inlineStatsCommand();
				}
				break;
			case 34:
				this.enterOuterAlt(localctx, 20);
				{
				this.state = 314;
				this.fuseCommand();
				}
				break;
			case 20:
				this.enterOuterAlt(localctx, 21);
				{
				this.state = 315;
				this.uriPartsCommand();
				}
				break;
			case 21:
				this.enterOuterAlt(localctx, 22);
				{
				this.state = 316;
				this.metricsInfoCommand();
				}
				break;
			case 22:
				this.enterOuterAlt(localctx, 23);
				{
				this.state = 317;
				this.registeredDomainCommand();
				}
				break;
			case 23:
				this.enterOuterAlt(localctx, 24);
				{
				this.state = 318;
				this.tsInfoCommand();
				}
				break;
			case 24:
				this.enterOuterAlt(localctx, 25);
				{
				this.state = 319;
				this.userAgentCommand();
				}
				break;
			case 25:
				this.enterOuterAlt(localctx, 26);
				{
				this.state = 320;
				this.tsCollapseCommand();
				}
				break;
			case 26:
				this.enterOuterAlt(localctx, 27);
				{
				this.state = 321;
				this.ipLocationCommand();
				}
				break;
			case 43:
				this.enterOuterAlt(localctx, 28);
				{
				this.state = 322;
				this.mmrCommand();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 29);
				{
				this.state = 323;
				this.highlightCommand();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 30);
				{
				this.state = 324;
				this.denseVectorCommand();
				}
				break;
			case 42:
				this.enterOuterAlt(localctx, 31);
				{
				this.state = 325;
				this.lookupCommand();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 32);
				{
				this.state = 326;
				this.dedupCommand();
				}
				break;
			case 28:
				this.enterOuterAlt(localctx, 33);
				{
				this.state = 327;
				this.fillNullCommand();
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 34);
				{
				this.state = 328;
				this.describeCommand();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public whereCommand(): WhereCommandContext {
		let localctx: WhereCommandContext = new WhereCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, esql_parser.RULE_whereCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 331;
			this.match(esql_parser.WHERE);
			this.state = 332;
			this.booleanExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dataType(): DataTypeContext {
		let localctx: DataTypeContext = new DataTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, esql_parser.RULE_dataType);
		try {
			localctx = new ToDataTypeContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 334;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rowCommand(): RowCommandContext {
		let localctx: RowCommandContext = new RowCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, esql_parser.RULE_rowCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 336;
			this.match(esql_parser.ROW);
			this.state = 337;
			this.fields();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fields(): FieldsContext {
		let localctx: FieldsContext = new FieldsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, esql_parser.RULE_fields);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 339;
			this.field();
			this.state = 344;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 5, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 340;
					this.match(esql_parser.COMMA);
					this.state = 341;
					this.field();
					}
					}
				}
				this.state = 346;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 5, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public field(): FieldContext {
		let localctx: FieldContext = new FieldContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, esql_parser.RULE_field);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 350;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				{
				this.state = 347;
				this.qualifiedName();
				this.state = 348;
				this.match(esql_parser.ASSIGN);
				}
				break;
			}
			this.state = 352;
			this.booleanExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fromCommand(): FromCommandContext {
		let localctx: FromCommandContext = new FromCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, esql_parser.RULE_fromCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 354;
			this.match(esql_parser.FROM);
			this.state = 355;
			this.indexPatternAndMetadataFields();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public timeSeriesCommand(): TimeSeriesCommandContext {
		let localctx: TimeSeriesCommandContext = new TimeSeriesCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, esql_parser.RULE_timeSeriesCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 357;
			this.match(esql_parser.TS);
			this.state = 358;
			this.indexPatternAndMetadataFields();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public externalCommand(): ExternalCommandContext {
		let localctx: ExternalCommandContext = new ExternalCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, esql_parser.RULE_externalCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 360;
			this.match(esql_parser.DEV_EXTERNAL);
			this.state = 361;
			this.stringOrParameter();
			this.state = 362;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public indexPatternAndMetadataFields(): IndexPatternAndMetadataFieldsContext {
		let localctx: IndexPatternAndMetadataFieldsContext = new IndexPatternAndMetadataFieldsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, esql_parser.RULE_indexPatternAndMetadataFields);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 364;
			this.indexPatternOrSubquery();
			this.state = 369;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 7, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 365;
					this.match(esql_parser.COMMA);
					this.state = 366;
					this.indexPatternOrSubquery();
					}
					}
				}
				this.state = 371;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 7, this._ctx);
			}
			this.state = 373;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 372;
				this.metadata();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public indexPatternOrSubquery(): IndexPatternOrSubqueryContext {
		let localctx: IndexPatternOrSubqueryContext = new IndexPatternOrSubqueryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, esql_parser.RULE_indexPatternOrSubquery);
		try {
			this.state = 377;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
			case 126:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 375;
				this.indexPattern();
				}
				break;
			case 114:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 376;
				this.subquery();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subquery(): SubqueryContext {
		let localctx: SubqueryContext = new SubqueryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, esql_parser.RULE_subquery);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 379;
			this.match(esql_parser.LP);
			this.state = 380;
			this.subquerySourceCommand();
			this.state = 385;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===65) {
				{
				{
				this.state = 381;
				this.match(esql_parser.PIPE);
				this.state = 382;
				this.processingCommand();
				}
				}
				this.state = 387;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 388;
			this.match(esql_parser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subquerySourceCommand(): SubquerySourceCommandContext {
		let localctx: SubquerySourceCommandContext = new SubquerySourceCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, esql_parser.RULE_subquerySourceCommand);
		try {
			this.state = 393;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 29:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 390;
				this.fromCommand();
				}
				break;
			case 15:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 391;
				this.rowCommand();
				}
				break;
			case 30:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 392;
				this.timeSeriesCommand();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public indexPattern(): IndexPatternContext {
		let localctx: IndexPatternContext = new IndexPatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, esql_parser.RULE_indexPattern);
		try {
			this.state = 406;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 398;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 12, this._ctx) ) {
				case 1:
					{
					this.state = 395;
					this.clusterString();
					this.state = 396;
					this.match(esql_parser.COLON);
					}
					break;
				}
				this.state = 400;
				this.unquotedIndexString();
				this.state = 403;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 13, this._ctx) ) {
				case 1:
					{
					this.state = 401;
					this.match(esql_parser.CAST_OP);
					this.state = 402;
					this.selectorString();
					}
					break;
				}
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 405;
				this.indexString();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public clusterString(): ClusterStringContext {
		let localctx: ClusterStringContext = new ClusterStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, esql_parser.RULE_clusterString);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 408;
			this.match(esql_parser.UNQUOTED_SOURCE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public selectorString(): SelectorStringContext {
		let localctx: SelectorStringContext = new SelectorStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, esql_parser.RULE_selectorString);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 410;
			this.match(esql_parser.UNQUOTED_SOURCE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unquotedIndexString(): UnquotedIndexStringContext {
		let localctx: UnquotedIndexStringContext = new UnquotedIndexStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, esql_parser.RULE_unquotedIndexString);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 412;
			this.match(esql_parser.UNQUOTED_SOURCE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public indexString(): IndexStringContext {
		let localctx: IndexStringContext = new IndexStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, esql_parser.RULE_indexString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 414;
			_la = this._input.LA(1);
			if(!(_la===66 || _la===126)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public metadata(): MetadataContext {
		let localctx: MetadataContext = new MetadataContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, esql_parser.RULE_metadata);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 416;
			this.match(esql_parser.METADATA);
			this.state = 417;
			this.match(esql_parser.UNQUOTED_SOURCE);
			this.state = 422;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 418;
					this.match(esql_parser.COMMA);
					this.state = 419;
					this.match(esql_parser.UNQUOTED_SOURCE);
					}
					}
				}
				this.state = 424;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 15, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public evalCommand(): EvalCommandContext {
		let localctx: EvalCommandContext = new EvalCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, esql_parser.RULE_evalCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 425;
			this.match(esql_parser.EVAL);
			this.state = 426;
			this.fields();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public statsCommand(): StatsCommandContext {
		let localctx: StatsCommandContext = new StatsCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, esql_parser.RULE_statsCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 428;
			this.match(esql_parser.STATS);
			this.state = 430;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				{
				this.state = 429;
				localctx._stats = this.aggFields();
				}
				break;
			}
			this.state = 434;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 432;
				this.match(esql_parser.BY);
				this.state = 433;
				localctx._grouping = this.fields();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public aggFields(): AggFieldsContext {
		let localctx: AggFieldsContext = new AggFieldsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, esql_parser.RULE_aggFields);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 436;
			this.aggField();
			this.state = 441;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 437;
					this.match(esql_parser.COMMA);
					this.state = 438;
					this.aggField();
					}
					}
				}
				this.state = 443;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public aggField(): AggFieldContext {
		let localctx: AggFieldContext = new AggFieldContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, esql_parser.RULE_aggField);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 444;
			this.field();
			this.state = 447;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 19, this._ctx) ) {
			case 1:
				{
				this.state = 445;
				this.match(esql_parser.WHERE);
				this.state = 446;
				this.booleanExpression(0);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedName(): QualifiedNameContext {
		let localctx: QualifiedNameContext = new QualifiedNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, esql_parser.RULE_qualifiedName);
		let _la: number;
		try {
			this.state = 460;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 112:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 449;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 451;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116) {
					{
					this.state = 450;
					localctx._qualifier = this.match(esql_parser.UNQUOTED_IDENTIFIER);
					}
				}

				this.state = 453;
				this.match(esql_parser.CLOSING_BRACKET);
				this.state = 454;
				this.match(esql_parser.DOT);
				this.state = 455;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 456;
				localctx._name = this.fieldName();
				this.state = 457;
				this.match(esql_parser.CLOSING_BRACKET);
				}
				break;
			case 90:
			case 109:
			case 110:
			case 111:
			case 116:
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 459;
				localctx._name = this.fieldName();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldName(): FieldNameContext {
		let localctx: FieldNameContext = new FieldNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, esql_parser.RULE_fieldName);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 462;
			this.identifierOrParameter();
			this.state = 467;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 463;
					this.match(esql_parser.DOT);
					this.state = 464;
					this.identifierOrParameter();
					}
					}
				}
				this.state = 469;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedNamePattern(): QualifiedNamePatternContext {
		let localctx: QualifiedNamePatternContext = new QualifiedNamePatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, esql_parser.RULE_qualifiedNamePattern);
		let _la: number;
		try {
			this.state = 481;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 112:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 470;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 472;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===168) {
					{
					this.state = 471;
					localctx._qualifier = this.match(esql_parser.ID_PATTERN);
					}
				}

				this.state = 474;
				this.match(esql_parser.CLOSING_BRACKET);
				this.state = 475;
				this.match(esql_parser.DOT);
				this.state = 476;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 477;
				localctx._name = this.fieldNamePattern();
				this.state = 478;
				this.match(esql_parser.CLOSING_BRACKET);
				}
				break;
			case 90:
			case 103:
			case 109:
			case 110:
			case 111:
			case 116:
			case 117:
			case 168:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 480;
				localctx._name = this.fieldNamePattern();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldNamePattern(): FieldNamePatternContext {
		let localctx: FieldNamePatternContext = new FieldNamePatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, esql_parser.RULE_fieldNamePattern);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 483;
			this.identifierPattern();
			this.state = 488;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 484;
					this.match(esql_parser.DOT);
					this.state = 485;
					this.identifierPattern();
					}
					}
				}
				this.state = 490;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
			}
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		let localctx: QualifiedNamePatternsContext = new QualifiedNamePatternsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, esql_parser.RULE_qualifiedNamePatterns);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 491;
			this.qualifiedNamePattern();
			this.state = 496;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 26, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 492;
					this.match(esql_parser.COMMA);
					this.state = 493;
					this.qualifiedNamePattern();
					}
					}
				}
				this.state = 498;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 26, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifier(): IdentifierContext {
		let localctx: IdentifierContext = new IdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, esql_parser.RULE_identifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 499;
			_la = this._input.LA(1);
			if(!(_la===116 || _la===117)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifierPattern(): IdentifierPatternContext {
		let localctx: IdentifierPatternContext = new IdentifierPatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, esql_parser.RULE_identifierPattern);
		try {
			this.state = 505;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 168:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 501;
				this.match(esql_parser.ID_PATTERN);
				}
				break;
			case 103:
			case 116:
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 502;
				this.expressionModeIdentifierPattern();
				}
				break;
			case 90:
			case 110:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 503;
				this.parameter();
				}
				break;
			case 109:
			case 111:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 504;
				this.doubleParameter();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expressionModeIdentifierPattern(): ExpressionModeIdentifierPatternContext {
		let localctx: ExpressionModeIdentifierPatternContext = new ExpressionModeIdentifierPatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, esql_parser.RULE_expressionModeIdentifierPattern);
		let _la: number;
		try {
			let _alt: number;
			this.state = 519;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 31, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 508;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || _la===117) {
					{
					this.state = 507;
					this.identifier();
					}
				}

				this.state = 510;
				this.match(esql_parser.ASTERISK);
				this.state = 515;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 30, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						this.state = 513;
						this._errHandler.sync(this);
						switch (this._input.LA(1)) {
						case 116:
						case 117:
							{
							this.state = 511;
							this.identifier();
							}
							break;
						case 103:
							{
							this.state = 512;
							this.match(esql_parser.ASTERISK);
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						}
					}
					this.state = 517;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 30, this._ctx);
				}
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 518;
				this.identifier();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let localctx: ParameterContext = new ParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, esql_parser.RULE_parameter);
		try {
			this.state = 523;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 90:
				localctx = new InputParamContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 521;
				this.match(esql_parser.PARAM);
				}
				break;
			case 110:
				localctx = new InputNamedOrPositionalParamContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 522;
				this.match(esql_parser.NAMED_OR_POSITIONAL_PARAM);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public doubleParameter(): DoubleParameterContext {
		let localctx: DoubleParameterContext = new DoubleParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, esql_parser.RULE_doubleParameter);
		try {
			this.state = 527;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 109:
				localctx = new InputDoubleParamsContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 525;
				this.match(esql_parser.DOUBLE_PARAMS);
				}
				break;
			case 111:
				localctx = new InputNamedOrPositionalDoubleParamsContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 526;
				this.match(esql_parser.NAMED_OR_POSITIONAL_DOUBLE_PARAMS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifierOrParameter(): IdentifierOrParameterContext {
		let localctx: IdentifierOrParameterContext = new IdentifierOrParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, esql_parser.RULE_identifierOrParameter);
		try {
			this.state = 532;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 116:
			case 117:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 529;
				this.identifier();
				}
				break;
			case 90:
			case 110:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 530;
				this.parameter();
				}
				break;
			case 109:
			case 111:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 531;
				this.doubleParameter();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stringOrParameter(): StringOrParameterContext {
		let localctx: StringOrParameterContext = new StringOrParameterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, esql_parser.RULE_stringOrParameter);
		try {
			this.state = 536;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 534;
				this.string_();
				}
				break;
			case 90:
			case 110:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 535;
				this.parameter();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public limitCommand(): LimitCommandContext {
		let localctx: LimitCommandContext = new LimitCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, esql_parser.RULE_limitCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 538;
			this.match(esql_parser.LIMIT);
			this.state = 539;
			this.constant();
			this.state = 541;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 36, this._ctx) ) {
			case 1:
				{
				this.state = 540;
				this.limitByGroupKey();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public limitByGroupKey(): LimitByGroupKeyContext {
		let localctx: LimitByGroupKeyContext = new LimitByGroupKeyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, esql_parser.RULE_limitByGroupKey);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 543;
			this.match(esql_parser.BY);
			this.state = 544;
			this.booleanExpression(0);
			this.state = 549;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 37, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 545;
					this.match(esql_parser.COMMA);
					this.state = 546;
					this.booleanExpression(0);
					}
					}
				}
				this.state = 551;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 37, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sortCommand(): SortCommandContext {
		let localctx: SortCommandContext = new SortCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, esql_parser.RULE_sortCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 552;
			this.match(esql_parser.SORT);
			this.state = 553;
			this.orderExpression();
			this.state = 558;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 38, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 554;
					this.match(esql_parser.COMMA);
					this.state = 555;
					this.orderExpression();
					}
					}
				}
				this.state = 560;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 38, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public orderExpression(): OrderExpressionContext {
		let localctx: OrderExpressionContext = new OrderExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, esql_parser.RULE_orderExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 561;
			this.booleanExpression(0);
			this.state = 563;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				{
				this.state = 562;
				localctx._ordering = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===70 || _la===77)) {
				    localctx._ordering = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			this.state = 567;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 40, this._ctx) ) {
			case 1:
				{
				this.state = 565;
				this.match(esql_parser.NULLS);
				this.state = 566;
				localctx._nullOrdering = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===80 || _la===83)) {
				    localctx._nullOrdering = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keepCommand(): KeepCommandContext {
		let localctx: KeepCommandContext = new KeepCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, esql_parser.RULE_keepCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 569;
			this.match(esql_parser.KEEP);
			this.state = 570;
			this.qualifiedNamePatterns();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dropCommand(): DropCommandContext {
		let localctx: DropCommandContext = new DropCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, esql_parser.RULE_dropCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 572;
			this.match(esql_parser.DROP);
			this.state = 573;
			this.qualifiedNamePatterns();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public renameCommand(): RenameCommandContext {
		let localctx: RenameCommandContext = new RenameCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, esql_parser.RULE_renameCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 575;
			this.match(esql_parser.RENAME);
			this.state = 576;
			this.renameClause();
			this.state = 581;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 41, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 577;
					this.match(esql_parser.COMMA);
					this.state = 578;
					this.renameClause();
					}
					}
				}
				this.state = 583;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 41, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public renameClause(): RenameClauseContext {
		let localctx: RenameClauseContext = new RenameClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, esql_parser.RULE_renameClause);
		try {
			this.state = 592;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 42, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 584;
				localctx._oldName = this.qualifiedNamePattern();
				this.state = 585;
				this.match(esql_parser.AS);
				this.state = 586;
				localctx._newName = this.qualifiedNamePattern();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 588;
				localctx._newName = this.qualifiedNamePattern();
				this.state = 589;
				this.match(esql_parser.ASSIGN);
				this.state = 590;
				localctx._oldName = this.qualifiedNamePattern();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dissectCommand(): DissectCommandContext {
		let localctx: DissectCommandContext = new DissectCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, esql_parser.RULE_dissectCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 594;
			this.match(esql_parser.DISSECT);
			this.state = 595;
			this.primaryExpression(0);
			this.state = 596;
			this.string_();
			this.state = 598;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 43, this._ctx) ) {
			case 1:
				{
				this.state = 597;
				this.dissectCommandOptions();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dissectCommandOptions(): DissectCommandOptionsContext {
		let localctx: DissectCommandOptionsContext = new DissectCommandOptionsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, esql_parser.RULE_dissectCommandOptions);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 600;
			this.dissectCommandOption();
			this.state = 605;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 44, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 601;
					this.match(esql_parser.COMMA);
					this.state = 602;
					this.dissectCommandOption();
					}
					}
				}
				this.state = 607;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 44, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dissectCommandOption(): DissectCommandOptionContext {
		let localctx: DissectCommandOptionContext = new DissectCommandOptionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, esql_parser.RULE_dissectCommandOption);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 608;
			this.identifier();
			this.state = 609;
			this.match(esql_parser.ASSIGN);
			this.state = 610;
			this.constant();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commandNamedParameters(): CommandNamedParametersContext {
		let localctx: CommandNamedParametersContext = new CommandNamedParametersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, esql_parser.RULE_commandNamedParameters);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 614;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 45, this._ctx) ) {
			case 1:
				{
				this.state = 612;
				this.match(esql_parser.WITH);
				this.state = 613;
				this.mapExpression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public grokCommand(): GrokCommandContext {
		let localctx: GrokCommandContext = new GrokCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, esql_parser.RULE_grokCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 616;
			this.match(esql_parser.GROK);
			this.state = 617;
			this.primaryExpression(0);
			this.state = 618;
			this.string_();
			this.state = 623;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 619;
					this.match(esql_parser.COMMA);
					this.state = 620;
					this.string_();
					}
					}
				}
				this.state = 625;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mvExpandCommand(): MvExpandCommandContext {
		let localctx: MvExpandCommandContext = new MvExpandCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, esql_parser.RULE_mvExpandCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 626;
			this.match(esql_parser.MV_EXPAND);
			this.state = 627;
			this.qualifiedName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explainCommand(): ExplainCommandContext {
		let localctx: ExplainCommandContext = new ExplainCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, esql_parser.RULE_explainCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 629;
			this.match(esql_parser.DEV_EXPLAIN);
			this.state = 630;
			this.subqueryExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subqueryExpression(): SubqueryExpressionContext {
		let localctx: SubqueryExpressionContext = new SubqueryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, esql_parser.RULE_subqueryExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 632;
			this.match(esql_parser.LP);
			this.state = 633;
			this.query(0);
			this.state = 634;
			this.match(esql_parser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public showCommand(): ShowCommandContext {
		let localctx: ShowCommandContext = new ShowCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, esql_parser.RULE_showCommand);
		try {
			localctx = new ShowInfoContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 636;
			this.match(esql_parser.SHOW);
			this.state = 637;
			this.match(esql_parser.INFO);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enrichCommand(): EnrichCommandContext {
		let localctx: EnrichCommandContext = new EnrichCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, esql_parser.RULE_enrichCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 639;
			this.match(esql_parser.ENRICH);
			this.state = 640;
			localctx._policyName = this.enrichPolicyName();
			this.state = 643;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 47, this._ctx) ) {
			case 1:
				{
				this.state = 641;
				this.match(esql_parser.ON);
				this.state = 642;
				localctx._matchField = this.qualifiedNamePattern();
				}
				break;
			}
			this.state = 654;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				{
				this.state = 645;
				this.match(esql_parser.WITH);
				this.state = 646;
				this.enrichWithClause();
				this.state = 651;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 48, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 647;
						this.match(esql_parser.COMMA);
						this.state = 648;
						this.enrichWithClause();
						}
						}
					}
					this.state = 653;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 48, this._ctx);
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enrichPolicyName(): EnrichPolicyNameContext {
		let localctx: EnrichPolicyNameContext = new EnrichPolicyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, esql_parser.RULE_enrichPolicyName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 656;
			_la = this._input.LA(1);
			if(!(_la===55 || _la===66)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enrichWithClause(): EnrichWithClauseContext {
		let localctx: EnrichWithClauseContext = new EnrichWithClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, esql_parser.RULE_enrichWithClause);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 661;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 50, this._ctx) ) {
			case 1:
				{
				this.state = 658;
				localctx._newName = this.qualifiedNamePattern();
				this.state = 659;
				this.match(esql_parser.ASSIGN);
				}
				break;
			}
			this.state = 663;
			localctx._enrichField = this.qualifiedNamePattern();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sampleCommand(): SampleCommandContext {
		let localctx: SampleCommandContext = new SampleCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, esql_parser.RULE_sampleCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 665;
			this.match(esql_parser.SAMPLE);
			this.state = 666;
			localctx._probability = this.constant();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public changePointCommand(): ChangePointCommandContext {
		let localctx: ChangePointCommandContext = new ChangePointCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, esql_parser.RULE_changePointCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 668;
			this.match(esql_parser.CHANGE_POINT);
			this.state = 669;
			localctx._value = this.qualifiedName();
			this.state = 672;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 51, this._ctx) ) {
			case 1:
				{
				this.state = 670;
				this.match(esql_parser.ON);
				this.state = 671;
				localctx._key = this.qualifiedName();
				}
				break;
			}
			this.state = 679;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 52, this._ctx) ) {
			case 1:
				{
				this.state = 674;
				this.match(esql_parser.AS);
				this.state = 675;
				localctx._targetType = this.qualifiedName();
				this.state = 676;
				this.match(esql_parser.COMMA);
				this.state = 677;
				localctx._targetPvalue = this.qualifiedName();
				}
				break;
			}
			this.state = 690;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 54, this._ctx) ) {
			case 1:
				{
				this.state = 681;
				this.match(esql_parser.BY);
				this.state = 682;
				localctx._booleanExpression = this.booleanExpression(0);
				localctx._groupings.push(localctx._booleanExpression);
				this.state = 687;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 53, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 683;
						this.match(esql_parser.COMMA);
						this.state = 684;
						localctx._booleanExpression = this.booleanExpression(0);
						localctx._groupings.push(localctx._booleanExpression);
						}
						}
					}
					this.state = 689;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 53, this._ctx);
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forkCommand(): ForkCommandContext {
		let localctx: ForkCommandContext = new ForkCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, esql_parser.RULE_forkCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 692;
			this.match(esql_parser.FORK);
			this.state = 693;
			this.forkSubQueries();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forkSubQueries(): ForkSubQueriesContext {
		let localctx: ForkSubQueriesContext = new ForkSubQueriesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, esql_parser.RULE_forkSubQueries);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 696;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 695;
					this.forkSubQuery();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 698;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 55, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forkSubQuery(): ForkSubQueryContext {
		let localctx: ForkSubQueryContext = new ForkSubQueryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, esql_parser.RULE_forkSubQuery);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 700;
			this.match(esql_parser.LP);
			this.state = 701;
			this.forkSubQueryCommand(0);
			this.state = 702;
			this.match(esql_parser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public forkSubQueryCommand(): ForkSubQueryCommandContext;
	public forkSubQueryCommand(_p: number): ForkSubQueryCommandContext;
	// @RuleVersion(0)
	public forkSubQueryCommand(_p?: number): ForkSubQueryCommandContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ForkSubQueryCommandContext = new ForkSubQueryCommandContext(this, this._ctx, _parentState);
		let _prevctx: ForkSubQueryCommandContext = localctx;
		let _startState: number = 128;
		this.enterRecursionRule(localctx, 128, esql_parser.RULE_forkSubQueryCommand, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			localctx = new SingleForkSubQueryCommandContext(this, localctx);
			this._ctx = localctx;
			_prevctx = localctx;

			this.state = 705;
			this.forkSubQueryProcessingCommand();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 712;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new CompositeForkSubQueryContext(this, new ForkSubQueryCommandContext(this, _parentctx, _parentState));
					this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_forkSubQueryCommand);
					this.state = 707;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 708;
					this.match(esql_parser.PIPE);
					this.state = 709;
					this.forkSubQueryProcessingCommand();
					}
					}
				}
				this.state = 714;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public forkSubQueryProcessingCommand(): ForkSubQueryProcessingCommandContext {
		let localctx: ForkSubQueryProcessingCommandContext = new ForkSubQueryProcessingCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, esql_parser.RULE_forkSubQueryProcessingCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 715;
			this.processingCommand();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rerankCommand(): RerankCommandContext {
		let localctx: RerankCommandContext = new RerankCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, esql_parser.RULE_rerankCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 717;
			this.match(esql_parser.RERANK);
			this.state = 721;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				this.state = 718;
				localctx._targetField = this.qualifiedName();
				this.state = 719;
				this.match(esql_parser.ASSIGN);
				}
				break;
			}
			this.state = 723;
			localctx._queryText = this.constant();
			this.state = 724;
			this.match(esql_parser.ON);
			this.state = 725;
			localctx._rerankFields = this.fields();
			this.state = 726;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public completionCommand(): CompletionCommandContext {
		let localctx: CompletionCommandContext = new CompletionCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, esql_parser.RULE_completionCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 728;
			this.match(esql_parser.COMPLETION);
			this.state = 732;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 58, this._ctx) ) {
			case 1:
				{
				this.state = 729;
				localctx._targetField = this.qualifiedName();
				this.state = 730;
				this.match(esql_parser.ASSIGN);
				}
				break;
			}
			this.state = 734;
			localctx._prompt = this.primaryExpression(0);
			this.state = 735;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inlineStatsCommand(): InlineStatsCommandContext {
		let localctx: InlineStatsCommandContext = new InlineStatsCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, esql_parser.RULE_inlineStatsCommand);
		try {
			this.state = 750;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 36:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 737;
				this.match(esql_parser.INLINE);
				this.state = 738;
				this.match(esql_parser.INLINE_STATS);
				this.state = 739;
				localctx._stats = this.aggFields();
				this.state = 742;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 59, this._ctx) ) {
				case 1:
					{
					this.state = 740;
					this.match(esql_parser.BY);
					this.state = 741;
					localctx._grouping = this.fields();
					}
					break;
				}
				}
				break;
			case 37:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 744;
				this.match(esql_parser.INLINESTATS);
				this.state = 745;
				localctx._stats = this.aggFields();
				this.state = 748;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 60, this._ctx) ) {
				case 1:
					{
					this.state = 746;
					this.match(esql_parser.BY);
					this.state = 747;
					localctx._grouping = this.fields();
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fuseCommand(): FuseCommandContext {
		let localctx: FuseCommandContext = new FuseCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, esql_parser.RULE_fuseCommand);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 752;
			this.match(esql_parser.FUSE);
			this.state = 754;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				{
				this.state = 753;
				localctx._fuseType = this.identifier();
				}
				break;
			}
			this.state = 759;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 756;
					this.fuseConfiguration();
					}
					}
				}
				this.state = 761;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 63, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fuseConfiguration(): FuseConfigurationContext {
		let localctx: FuseConfigurationContext = new FuseConfigurationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, esql_parser.RULE_fuseConfiguration);
		try {
			this.state = 773;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 137:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 762;
				this.match(esql_parser.SCORE);
				this.state = 763;
				this.match(esql_parser.BY);
				this.state = 764;
				localctx._score = this.qualifiedName();
				}
				break;
			case 138:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 765;
				this.match(esql_parser.KEY);
				this.state = 766;
				this.match(esql_parser.BY);
				this.state = 767;
				localctx._key = this.fuseKeyByFields();
				}
				break;
			case 136:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 768;
				this.match(esql_parser.GROUP);
				this.state = 769;
				this.match(esql_parser.BY);
				this.state = 770;
				localctx._group = this.qualifiedName();
				}
				break;
			case 93:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 771;
				this.match(esql_parser.WITH);
				this.state = 772;
				localctx._options = this.mapExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fuseKeyByFields(): FuseKeyByFieldsContext {
		let localctx: FuseKeyByFieldsContext = new FuseKeyByFieldsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, esql_parser.RULE_fuseKeyByFields);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 775;
			this.qualifiedName();
			this.state = 780;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 65, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 776;
					this.match(esql_parser.COMMA);
					this.state = 777;
					this.qualifiedName();
					}
					}
				}
				this.state = 782;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 65, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public metricsInfoCommand(): MetricsInfoCommandContext {
		let localctx: MetricsInfoCommandContext = new MetricsInfoCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, esql_parser.RULE_metricsInfoCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 783;
			this.match(esql_parser.METRICS_INFO);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tsInfoCommand(): TsInfoCommandContext {
		let localctx: TsInfoCommandContext = new TsInfoCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, esql_parser.RULE_tsInfoCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 785;
			this.match(esql_parser.TS_INFO);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tsCollapseCommand(): TsCollapseCommandContext {
		let localctx: TsCollapseCommandContext = new TsCollapseCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, esql_parser.RULE_tsCollapseCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 787;
			this.match(esql_parser.TS_COLLAPSE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public describeCommand(): DescribeCommandContext {
		let localctx: DescribeCommandContext = new DescribeCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, esql_parser.RULE_describeCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 789;
			this.match(esql_parser.DEV_DESCRIBE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lookupCommand(): LookupCommandContext {
		let localctx: LookupCommandContext = new LookupCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, esql_parser.RULE_lookupCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 791;
			this.match(esql_parser.DEV_LOOKUP);
			this.state = 792;
			localctx._tableName = this.indexPattern();
			this.state = 793;
			this.match(esql_parser.ON);
			this.state = 794;
			localctx._matchFields = this.qualifiedNamePatterns();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dedupCommand(): DedupCommandContext {
		let localctx: DedupCommandContext = new DedupCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, esql_parser.RULE_dedupCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 796;
			this.match(esql_parser.DEDUP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public highlightCommand(): HighlightCommandContext {
		let localctx: HighlightCommandContext = new HighlightCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, esql_parser.RULE_highlightCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 798;
			this.match(esql_parser.HIGHLIGHT);
			this.state = 803;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 66, this._ctx) ) {
			case 1:
				{
				this.state = 799;
				localctx._prefixKeyword = this.identifier();
				this.state = 800;
				this.match(esql_parser.ASSIGN);
				this.state = 801;
				localctx._prefix = this.string_();
				}
				break;
			}
			this.state = 806;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 67, this._ctx) ) {
			case 1:
				{
				this.state = 805;
				localctx._queryExpression = this.booleanExpression(0);
				}
				break;
			}
			this.state = 810;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 68, this._ctx) ) {
			case 1:
				{
				this.state = 808;
				this.match(esql_parser.ON);
				this.state = 809;
				localctx._highlightFields = this.qualifiedNamePatterns();
				}
				break;
			}
			this.state = 812;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedNames(): QualifiedNamesContext {
		let localctx: QualifiedNamesContext = new QualifiedNamesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, esql_parser.RULE_qualifiedNames);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 814;
			this.qualifiedName();
			this.state = 819;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 69, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 815;
					this.match(esql_parser.COMMA);
					this.state = 816;
					this.qualifiedName();
					}
					}
				}
				this.state = 821;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 69, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fillNullCommand(): FillNullCommandContext {
		let localctx: FillNullCommandContext = new FillNullCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, esql_parser.RULE_fillNullCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 822;
			this.match(esql_parser.DEV_FILLNULL);
			this.state = 823;
			this.fillNullValue();
			this.state = 824;
			this.match(esql_parser.ON);
			this.state = 825;
			this.qualifiedNamePatterns();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fillNullValue(): FillNullValueContext {
		let localctx: FillNullValueContext = new FillNullValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, esql_parser.RULE_fillNullValue);
		try {
			this.state = 834;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 70, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 827;
				this.match(esql_parser.NULL);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 828;
				this.match(esql_parser.DEFAULT);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 829;
				this.integerValue();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 830;
				this.decimalValue();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 831;
				this.booleanValue();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 832;
				this.string_();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 833;
				this.parameter();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public uriPartsCommand(): UriPartsCommandContext {
		let localctx: UriPartsCommandContext = new UriPartsCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, esql_parser.RULE_uriPartsCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 836;
			this.match(esql_parser.URI_PARTS);
			this.state = 837;
			this.qualifiedName();
			this.state = 838;
			this.match(esql_parser.ASSIGN);
			this.state = 839;
			this.primaryExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public registeredDomainCommand(): RegisteredDomainCommandContext {
		let localctx: RegisteredDomainCommandContext = new RegisteredDomainCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, esql_parser.RULE_registeredDomainCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 841;
			this.match(esql_parser.REGISTERED_DOMAIN);
			this.state = 842;
			this.qualifiedName();
			this.state = 843;
			this.match(esql_parser.ASSIGN);
			this.state = 844;
			this.primaryExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public userAgentCommand(): UserAgentCommandContext {
		let localctx: UserAgentCommandContext = new UserAgentCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, esql_parser.RULE_userAgentCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 846;
			this.match(esql_parser.USER_AGENT);
			this.state = 847;
			this.qualifiedName();
			this.state = 848;
			this.match(esql_parser.ASSIGN);
			this.state = 849;
			this.primaryExpression(0);
			this.state = 850;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ipLocationCommand(): IpLocationCommandContext {
		let localctx: IpLocationCommandContext = new IpLocationCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, esql_parser.RULE_ipLocationCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 852;
			this.match(esql_parser.IP_LOCATION);
			this.state = 853;
			this.qualifiedName();
			this.state = 854;
			this.match(esql_parser.ASSIGN);
			this.state = 855;
			this.primaryExpression(0);
			this.state = 856;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public setCommand(): SetCommandContext {
		let localctx: SetCommandContext = new SetCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, esql_parser.RULE_setCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 858;
			this.match(esql_parser.SET);
			this.state = 859;
			this.setField();
			this.state = 860;
			this.match(esql_parser.SEMICOLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public setField(): SetFieldContext {
		let localctx: SetFieldContext = new SetFieldContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, esql_parser.RULE_setField);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 862;
			this.identifier();
			this.state = 863;
			this.match(esql_parser.ASSIGN);
			this.state = 866;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
			case 67:
			case 68:
			case 79:
			case 86:
			case 90:
			case 92:
			case 101:
			case 102:
			case 110:
			case 112:
				{
				this.state = 864;
				this.constant();
				}
				break;
			case 106:
				{
				this.state = 865;
				this.mapExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public letCommand(): LetCommandContext {
		let localctx: LetCommandContext = new LetCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, esql_parser.RULE_letCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 868;
			this.match(esql_parser.DEV_LET);
			this.state = 869;
			this.letBinding();
			this.state = 870;
			this.match(esql_parser.SEMICOLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public letBinding(): LetBindingContext {
		let localctx: LetBindingContext = new LetBindingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, esql_parser.RULE_letBinding);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 872;
			this.match(esql_parser.UNQUOTED_IDENTIFIER);
			this.state = 873;
			this.match(esql_parser.ASSIGN);
			this.state = 874;
			this.subquery();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mmrCommand(): MmrCommandContext {
		let localctx: MmrCommandContext = new MmrCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, esql_parser.RULE_mmrCommand);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 876;
			this.match(esql_parser.MMR);
			this.state = 878;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & 85090311) !== 0) || ((((_la - 101)) & ~0x1F) === 0 && ((1 << (_la - 101)) & 110339) !== 0)) {
				{
				this.state = 877;
				localctx._queryVector = this.mmrQueryVectorParams();
				}
			}

			this.state = 880;
			this.match(esql_parser.ON);
			this.state = 881;
			localctx._diversifyField = this.qualifiedName();
			this.state = 882;
			this.match(esql_parser.MMR_LIMIT);
			this.state = 883;
			localctx._limitValue = this.integerValue();
			this.state = 884;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mmrQueryVectorParams(): MmrQueryVectorParamsContext {
		let localctx: MmrQueryVectorParamsContext = new MmrQueryVectorParamsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, esql_parser.RULE_mmrQueryVectorParams);
		try {
			this.state = 888;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				localctx = new MmrQueryVectorParameterContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 886;
				this.parameter();
				}
				break;
			case 2:
				localctx = new MmrQueryVectorExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 887;
				this.primaryExpression(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public denseVectorCommand(): DenseVectorCommandContext {
		let localctx: DenseVectorCommandContext = new DenseVectorCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, esql_parser.RULE_denseVectorCommand);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 890;
			this.match(esql_parser.DENSE_VECTOR);
			this.state = 892;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 74, this._ctx) ) {
			case 1:
				{
				this.state = 891;
				this.denseVectorNaming();
				}
				break;
			}
			this.state = 895;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 75, this._ctx) ) {
			case 1:
				{
				this.state = 894;
				this.qualifiedNames();
				}
				break;
			}
			this.state = 897;
			this.commandNamedParameters();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public denseVectorNaming(): DenseVectorNamingContext {
		let localctx: DenseVectorNamingContext = new DenseVectorNamingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, esql_parser.RULE_denseVectorNaming);
		let _la: number;
		try {
			this.state = 913;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 77, this._ctx) ) {
			case 1:
				localctx = new DenseVectorTargetNameContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 899;
				(localctx as DenseVectorTargetNameContext)._targetField = this.qualifiedName();
				this.state = 900;
				this.match(esql_parser.ASSIGN);
				}
				break;
			case 2:
				localctx = new DenseVectorSuffixContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 902;
				(localctx as DenseVectorSuffixContext)._suffixKeyword = this.identifier();
				this.state = 903;
				this.match(esql_parser.ASSIGN);
				this.state = 904;
				(localctx as DenseVectorSuffixContext)._suffix = this.string_();
				this.state = 905;
				this.match(esql_parser.ON);
				}
				break;
			case 3:
				localctx = new DenseVectorLiteralInputContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 910;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 90)) & ~0x1F) === 0 && ((1 << (_la - 90)) & 209190913) !== 0)) {
					{
					this.state = 907;
					(localctx as DenseVectorLiteralInputContext)._targetField = this.qualifiedName();
					this.state = 908;
					this.match(esql_parser.ASSIGN);
					}
				}

				this.state = 912;
				(localctx as DenseVectorLiteralInputContext)._literalInput = this.string_();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public booleanExpression(): BooleanExpressionContext;
	public booleanExpression(_p: number): BooleanExpressionContext;
	// @RuleVersion(0)
	public booleanExpression(_p?: number): BooleanExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: BooleanExpressionContext = new BooleanExpressionContext(this, this._ctx, _parentState);
		let _prevctx: BooleanExpressionContext = localctx;
		let _startState: number = 188;
		this.enterRecursionRule(localctx, 188, esql_parser.RULE_booleanExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 966;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 84, this._ctx) ) {
			case 1:
				{
				localctx = new LogicalNotContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 916;
				this.match(esql_parser.NOT);
				this.state = 917;
				this.booleanExpression(10);
				}
				break;
			case 2:
				{
				localctx = new BooleanDefaultContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 918;
				this.valueExpression();
				}
				break;
			case 3:
				{
				localctx = new RegexExpressionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 919;
				this.regexBooleanExpression();
				}
				break;
			case 4:
				{
				localctx = new LogicalInContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 920;
				this.valueExpression();
				this.state = 922;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 921;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 924;
				this.match(esql_parser.IN);
				this.state = 925;
				this.match(esql_parser.LP);
				this.state = 926;
				this.valueExpression();
				this.state = 931;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 927;
					this.match(esql_parser.COMMA);
					this.state = 928;
					this.valueExpression();
					}
					}
					this.state = 933;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 934;
				this.match(esql_parser.RP);
				}
				break;
			case 5:
				{
				localctx = new LogicalInMultiColumnSubqueryContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 936;
				this.match(esql_parser.LP);
				this.state = 937;
				this.valueExpression();
				this.state = 940;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 938;
					this.match(esql_parser.COMMA);
					this.state = 939;
					this.valueExpression();
					}
					}
					this.state = 942;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===76);
				this.state = 944;
				this.match(esql_parser.RP);
				this.state = 946;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 945;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 948;
				this.match(esql_parser.IN);
				this.state = 949;
				this.subquery();
				}
				break;
			case 6:
				{
				localctx = new LogicalInSubqueryContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 951;
				this.valueExpression();
				this.state = 953;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 952;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 955;
				this.match(esql_parser.IN);
				this.state = 956;
				this.subquery();
				}
				break;
			case 7:
				{
				localctx = new IsNullContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 958;
				this.valueExpression();
				this.state = 959;
				this.match(esql_parser.IS);
				this.state = 961;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 960;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 963;
				this.match(esql_parser.NULL);
				}
				break;
			case 8:
				{
				localctx = new MatchExpressionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 965;
				this.matchBooleanExpression();
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 976;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 86, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 974;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 85, this._ctx) ) {
					case 1:
						{
						localctx = new LogicalBinaryContext(this, new BooleanExpressionContext(this, _parentctx, _parentState));
						(localctx as LogicalBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_booleanExpression);
						this.state = 968;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 969;
						(localctx as LogicalBinaryContext)._operator = this.match(esql_parser.AND);
						this.state = 970;
						(localctx as LogicalBinaryContext)._right = this.booleanExpression(8);
						}
						break;
					case 2:
						{
						localctx = new LogicalBinaryContext(this, new BooleanExpressionContext(this, _parentctx, _parentState));
						(localctx as LogicalBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_booleanExpression);
						this.state = 971;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 972;
						(localctx as LogicalBinaryContext)._operator = this.match(esql_parser.OR);
						this.state = 973;
						(localctx as LogicalBinaryContext)._right = this.booleanExpression(7);
						}
						break;
					}
					}
				}
				this.state = 978;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 86, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regexBooleanExpression(): RegexBooleanExpressionContext {
		let localctx: RegexBooleanExpressionContext = new RegexBooleanExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, esql_parser.RULE_regexBooleanExpression);
		let _la: number;
		try {
			this.state = 1025;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 93, this._ctx) ) {
			case 1:
				localctx = new LikeExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 979;
				this.valueExpression();
				this.state = 981;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 980;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 983;
				this.match(esql_parser.LIKE);
				this.state = 984;
				this.primaryExpression(0);
				}
				break;
			case 2:
				localctx = new RlikeExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 986;
				this.valueExpression();
				this.state = 988;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 987;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 990;
				this.match(esql_parser.RLIKE);
				this.state = 991;
				this.primaryExpression(0);
				}
				break;
			case 3:
				localctx = new LikeListExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 993;
				this.valueExpression();
				this.state = 995;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 994;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 997;
				this.match(esql_parser.LIKE);
				this.state = 998;
				this.match(esql_parser.LP);
				this.state = 999;
				this.stringOrParameter();
				this.state = 1004;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1000;
					this.match(esql_parser.COMMA);
					this.state = 1001;
					this.stringOrParameter();
					}
					}
					this.state = 1006;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1007;
				this.match(esql_parser.RP);
				}
				break;
			case 4:
				localctx = new RlikeListExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1009;
				this.valueExpression();
				this.state = 1011;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 1010;
					this.match(esql_parser.NOT);
					}
				}

				this.state = 1013;
				this.match(esql_parser.RLIKE);
				this.state = 1014;
				this.match(esql_parser.LP);
				this.state = 1015;
				this.stringOrParameter();
				this.state = 1020;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1016;
					this.match(esql_parser.COMMA);
					this.state = 1017;
					this.stringOrParameter();
					}
					}
					this.state = 1022;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1023;
				this.match(esql_parser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public matchBooleanExpression(): MatchBooleanExpressionContext {
		let localctx: MatchBooleanExpressionContext = new MatchBooleanExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, esql_parser.RULE_matchBooleanExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1027;
			localctx._fieldExp = this.primaryExpression(0);
			this.state = 1028;
			this.match(esql_parser.COLON);
			this.state = 1029;
			localctx._matchQuery = this.constant();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueExpression(): ValueExpressionContext {
		let localctx: ValueExpressionContext = new ValueExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, esql_parser.RULE_valueExpression);
		try {
			this.state = 1036;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 94, this._ctx) ) {
			case 1:
				localctx = new ValueExpressionDefaultContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1031;
				this.operatorExpression(0);
				}
				break;
			case 2:
				localctx = new ComparisonContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1032;
				(localctx as ComparisonContext)._left = this.operatorExpression(0);
				this.state = 1033;
				this.comparisonOperator();
				this.state = 1034;
				(localctx as ComparisonContext)._right = this.operatorExpression(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public operatorExpression(): OperatorExpressionContext;
	public operatorExpression(_p: number): OperatorExpressionContext;
	// @RuleVersion(0)
	public operatorExpression(_p?: number): OperatorExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: OperatorExpressionContext = new OperatorExpressionContext(this, this._ctx, _parentState);
		let _prevctx: OperatorExpressionContext = localctx;
		let _startState: number = 196;
		this.enterRecursionRule(localctx, 196, esql_parser.RULE_operatorExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1042;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 95, this._ctx) ) {
			case 1:
				{
				localctx = new OperatorExpressionDefaultContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 1039;
				this.primaryExpression(0);
				}
				break;
			case 2:
				{
				localctx = new ArithmeticUnaryContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1040;
				(localctx as ArithmeticUnaryContext)._operator = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===101 || _la===102)) {
				    (localctx as ArithmeticUnaryContext)._operator = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1041;
				this.operatorExpression(3);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1052;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1050;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 96, this._ctx) ) {
					case 1:
						{
						localctx = new ArithmeticBinaryContext(this, new OperatorExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_operatorExpression);
						this.state = 1044;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 1045;
						(localctx as ArithmeticBinaryContext)._operator = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(((((_la - 103)) & ~0x1F) === 0 && ((1 << (_la - 103)) & 7) !== 0))) {
						    (localctx as ArithmeticBinaryContext)._operator = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1046;
						(localctx as ArithmeticBinaryContext)._right = this.operatorExpression(3);
						}
						break;
					case 2:
						{
						localctx = new ArithmeticBinaryContext(this, new OperatorExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_operatorExpression);
						this.state = 1047;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 1048;
						(localctx as ArithmeticBinaryContext)._operator = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===101 || _la===102)) {
						    (localctx as ArithmeticBinaryContext)._operator = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1049;
						(localctx as ArithmeticBinaryContext)._right = this.operatorExpression(2);
						}
						break;
					}
					}
				}
				this.state = 1054;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}

	public primaryExpression(): PrimaryExpressionContext;
	public primaryExpression(_p: number): PrimaryExpressionContext;
	// @RuleVersion(0)
	public primaryExpression(_p?: number): PrimaryExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this, this._ctx, _parentState);
		let _prevctx: PrimaryExpressionContext = localctx;
		let _startState: number = 198;
		this.enterRecursionRule(localctx, 198, esql_parser.RULE_primaryExpression, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1063;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 98, this._ctx) ) {
			case 1:
				{
				localctx = new ConstantDefaultContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 1056;
				this.constant();
				}
				break;
			case 2:
				{
				localctx = new DereferenceContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1057;
				this.qualifiedName();
				}
				break;
			case 3:
				{
				localctx = new FunctionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1058;
				this.functionExpression();
				}
				break;
			case 4:
				{
				localctx = new ParenthesizedExpressionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1059;
				this.match(esql_parser.LP);
				this.state = 1060;
				this.booleanExpression(0);
				this.state = 1061;
				this.match(esql_parser.RP);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1070;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new InlineCastContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
					this.pushNewRecursionContext(localctx, _startState, esql_parser.RULE_primaryExpression);
					this.state = 1065;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1066;
					this.match(esql_parser.CAST_OP);
					this.state = 1067;
					this.dataType();
					}
					}
				}
				this.state = 1072;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionExpression(): FunctionExpressionContext {
		let localctx: FunctionExpressionContext = new FunctionExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, esql_parser.RULE_functionExpression);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1073;
			this.functionName();
			this.state = 1074;
			this.match(esql_parser.LP);
			this.state = 1094;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 103:
				{
				this.state = 1075;
				this.match(esql_parser.ASTERISK);
				}
				break;
			case 66:
			case 67:
			case 68:
			case 79:
			case 80:
			case 83:
			case 85:
			case 86:
			case 90:
			case 92:
			case 101:
			case 102:
			case 109:
			case 110:
			case 111:
			case 112:
			case 114:
			case 116:
			case 117:
				{
				{
				this.state = 1078;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 100, this._ctx) ) {
				case 1:
					{
					this.state = 1076;
					this.booleanExpression(0);
					}
					break;
				case 2:
					{
					this.state = 1077;
					this.lambda();
					}
					break;
				}
				this.state = 1087;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 102, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1080;
						this.match(esql_parser.COMMA);
						this.state = 1083;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 101, this._ctx) ) {
						case 1:
							{
							this.state = 1081;
							this.booleanExpression(0);
							}
							break;
						case 2:
							{
							this.state = 1082;
							this.lambda();
							}
							break;
						}
						}
						}
					}
					this.state = 1089;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 102, this._ctx);
				}
				this.state = 1092;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===76) {
					{
					this.state = 1090;
					this.match(esql_parser.COMMA);
					this.state = 1091;
					this.mapExpression();
					}
				}

				}
				}
				break;
			case 115:
				break;
			default:
				break;
			}
			this.state = 1096;
			this.match(esql_parser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionName(): FunctionNameContext {
		let localctx: FunctionNameContext = new FunctionNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, esql_parser.RULE_functionName);
		try {
			this.state = 1101;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 90:
			case 109:
			case 110:
			case 111:
			case 116:
			case 117:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1098;
				this.identifierOrParameter();
				}
				break;
			case 80:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1099;
				this.match(esql_parser.FIRST);
				}
				break;
			case 83:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1100;
				this.match(esql_parser.LAST);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lambda(): LambdaContext {
		let localctx: LambdaContext = new LambdaContext(this, this._ctx, this.state);
		this.enterRule(localctx, 204, esql_parser.RULE_lambda);
		let _la: number;
		try {
			this.state = 1121;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 114:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1103;
				this.match(esql_parser.LP);
				this.state = 1112;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || _la===117) {
					{
					this.state = 1104;
					this.identifier();
					this.state = 1109;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					while (_la===76) {
						{
						{
						this.state = 1105;
						this.match(esql_parser.COMMA);
						this.state = 1106;
						this.identifier();
						}
						}
						this.state = 1111;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					}
					}
				}

				this.state = 1114;
				this.match(esql_parser.RP);
				this.state = 1115;
				this.match(esql_parser.ARROW);
				this.state = 1116;
				this.booleanExpression(0);
				}
				break;
			case 116:
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1117;
				this.identifier();
				this.state = 1118;
				this.match(esql_parser.ARROW);
				this.state = 1119;
				this.booleanExpression(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mapExpression(): MapExpressionContext {
		let localctx: MapExpressionContext = new MapExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, esql_parser.RULE_mapExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1123;
			this.match(esql_parser.LEFT_BRACES);
			this.state = 1132;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 1124;
				this.entryExpression();
				this.state = 1129;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1125;
					this.match(esql_parser.COMMA);
					this.state = 1126;
					this.entryExpression();
					}
					}
					this.state = 1131;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 1134;
			this.match(esql_parser.RIGHT_BRACES);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entryExpression(): EntryExpressionContext {
		let localctx: EntryExpressionContext = new EntryExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, esql_parser.RULE_entryExpression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1136;
			localctx._key = this.string_();
			this.state = 1137;
			this.match(esql_parser.COLON);
			this.state = 1138;
			localctx._value = this.mapValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mapValue(): MapValueContext {
		let localctx: MapValueContext = new MapValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, esql_parser.RULE_mapValue);
		try {
			this.state = 1142;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
			case 67:
			case 68:
			case 79:
			case 86:
			case 90:
			case 92:
			case 101:
			case 102:
			case 110:
			case 112:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1140;
				this.constant();
				}
				break;
			case 106:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1141;
				this.mapExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constant(): ConstantContext {
		let localctx: ConstantContext = new ConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, esql_parser.RULE_constant);
		let _la: number;
		try {
			this.state = 1186;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				localctx = new NullLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1144;
				this.match(esql_parser.NULL);
				}
				break;
			case 2:
				localctx = new QualifiedIntegerLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1145;
				this.integerValue();
				this.state = 1146;
				this.match(esql_parser.UNQUOTED_IDENTIFIER);
				}
				break;
			case 3:
				localctx = new DecimalLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1148;
				this.decimalValue();
				}
				break;
			case 4:
				localctx = new IntegerLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1149;
				this.integerValue();
				}
				break;
			case 5:
				localctx = new BooleanLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1150;
				this.booleanValue();
				}
				break;
			case 6:
				localctx = new InputParameterContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1151;
				this.parameter();
				}
				break;
			case 7:
				localctx = new StringLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1152;
				this.string_();
				}
				break;
			case 8:
				localctx = new NumericArrayLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1153;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 1154;
				this.numericValue();
				this.state = 1159;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1155;
					this.match(esql_parser.COMMA);
					this.state = 1156;
					this.numericValue();
					}
					}
					this.state = 1161;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1162;
				this.match(esql_parser.CLOSING_BRACKET);
				}
				break;
			case 9:
				localctx = new BooleanArrayLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 1164;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 1165;
				this.booleanValue();
				this.state = 1170;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1166;
					this.match(esql_parser.COMMA);
					this.state = 1167;
					this.booleanValue();
					}
					}
					this.state = 1172;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1173;
				this.match(esql_parser.CLOSING_BRACKET);
				}
				break;
			case 10:
				localctx = new StringArrayLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 1175;
				this.match(esql_parser.OPENING_BRACKET);
				this.state = 1176;
				this.string_();
				this.state = 1181;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===76) {
					{
					{
					this.state = 1177;
					this.match(esql_parser.COMMA);
					this.state = 1178;
					this.string_();
					}
					}
					this.state = 1183;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1184;
				this.match(esql_parser.CLOSING_BRACKET);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanValue(): BooleanValueContext {
		let localctx: BooleanValueContext = new BooleanValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, esql_parser.RULE_booleanValue);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1188;
			_la = this._input.LA(1);
			if(!(_la===79 || _la===92)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public numericValue(): NumericValueContext {
		let localctx: NumericValueContext = new NumericValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, esql_parser.RULE_numericValue);
		try {
			this.state = 1192;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1190;
				this.decimalValue();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1191;
				this.integerValue();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public decimalValue(): DecimalValueContext {
		let localctx: DecimalValueContext = new DecimalValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, esql_parser.RULE_decimalValue);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1195;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===101 || _la===102) {
				{
				this.state = 1194;
				_la = this._input.LA(1);
				if(!(_la===101 || _la===102)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 1197;
			this.match(esql_parser.DECIMAL_LITERAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public integerValue(): IntegerValueContext {
		let localctx: IntegerValueContext = new IntegerValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, esql_parser.RULE_integerValue);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1200;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===101 || _la===102) {
				{
				this.state = 1199;
				_la = this._input.LA(1);
				if(!(_la===101 || _la===102)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 1202;
			this.match(esql_parser.INTEGER_LITERAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public string_(): StringContext {
		let localctx: StringContext = new StringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, esql_parser.RULE_string);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1204;
			this.match(esql_parser.QUOTED_STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparisonOperator(): ComparisonOperatorContext {
		let localctx: ComparisonOperatorContext = new ComparisonOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, esql_parser.RULE_comparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1206;
			_la = this._input.LA(1);
			if(!(((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 125) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public joinCommand(): JoinCommandContext {
		let localctx: JoinCommandContext = new JoinCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, esql_parser.RULE_joinCommand);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1208;
			localctx._type_ = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 13) !== 0))) {
			    localctx._type_ = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1209;
			this.match(esql_parser.JOIN);
			this.state = 1210;
			this.joinTarget();
			this.state = 1211;
			this.joinCondition();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public joinTarget(): JoinTargetContext {
		let localctx: JoinTargetContext = new JoinTargetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, esql_parser.RULE_joinTarget);
		let _la: number;
		try {
			this.state = 1220;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 120, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1213;
				localctx._index = this.indexPattern();
				this.state = 1215;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===178) {
					{
					this.state = 1214;
					this.match(esql_parser.AS);
					}
				}

				this.state = 1217;
				localctx._qualifier = this.match(esql_parser.UNQUOTED_SOURCE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1219;
				localctx._index = this.indexPattern();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public joinCondition(): JoinConditionContext {
		let localctx: JoinConditionContext = new JoinConditionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, esql_parser.RULE_joinCondition);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1222;
			this.match(esql_parser.ON);
			this.state = 1223;
			this.booleanExpression(0);
			this.state = 1228;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 121, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1224;
					this.match(esql_parser.COMMA);
					this.state = 1225;
					this.booleanExpression(0);
					}
					}
				}
				this.state = 1230;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 121, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlCommand(): PromqlCommandContext {
		let localctx: PromqlCommandContext = new PromqlCommandContext(this, this._ctx, this.state);
		this.enterRule(localctx, 232, esql_parser.RULE_promqlCommand);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1291;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 131, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1231;
				this.match(esql_parser.PROMQL);
				this.state = 1235;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 122, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1232;
						this.promqlParam();
						}
						}
					}
					this.state = 1237;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 122, this._ctx);
				}
				this.state = 1241;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || _la===117) {
					{
					this.state = 1238;
					this.valueName();
					this.state = 1239;
					this.match(esql_parser.ASSIGN);
					}
				}

				this.state = 1243;
				this.match(esql_parser.LP);
				this.state = 1244;
				this.match(esql_parser.NAMED_OR_POSITIONAL_PARAM);
				this.state = 1245;
				this.match(esql_parser.RP);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1246;
				this.match(esql_parser.PROMQL);
				this.state = 1250;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 124, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1247;
						this.promqlParam();
						}
						}
					}
					this.state = 1252;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 124, this._ctx);
				}
				this.state = 1256;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || _la===117) {
					{
					this.state = 1253;
					this.valueName();
					this.state = 1254;
					this.match(esql_parser.ASSIGN);
					}
				}

				this.state = 1258;
				this.match(esql_parser.NAMED_OR_POSITIONAL_PARAM);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1259;
				this.match(esql_parser.PROMQL);
				this.state = 1263;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 126, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1260;
						this.promqlParam();
						}
						}
					}
					this.state = 1265;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 126, this._ctx);
				}
				this.state = 1269;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || _la===117) {
					{
					this.state = 1266;
					this.valueName();
					this.state = 1267;
					this.match(esql_parser.ASSIGN);
					}
				}

				this.state = 1271;
				this.match(esql_parser.LP);
				this.state = 1273;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1272;
					this.promqlQueryPart();
					}
					}
					this.state = 1275;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & 1441) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & 65745) !== 0) || ((((_la - 175)) & ~0x1F) === 0 && ((1 << (_la - 175)) & 7) !== 0));
				this.state = 1277;
				this.match(esql_parser.RP);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1279;
				this.match(esql_parser.PROMQL);
				this.state = 1283;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 129, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1280;
						this.promqlParam();
						}
						}
					}
					this.state = 1285;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 129, this._ctx);
				}
				this.state = 1287;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 1286;
						this.promqlQueryPart();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 1289;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 130, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueName(): ValueNameContext {
		let localctx: ValueNameContext = new ValueNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 234, esql_parser.RULE_valueName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1293;
			_la = this._input.LA(1);
			if(!(_la===116 || _la===117)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlParam(): PromqlParamContext {
		let localctx: PromqlParamContext = new PromqlParamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 236, esql_parser.RULE_promqlParam);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1295;
			localctx._name = this.promqlParamName();
			this.state = 1296;
			this.match(esql_parser.ASSIGN);
			this.state = 1297;
			localctx._value = this.promqlParamValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlParamName(): PromqlParamNameContext {
		let localctx: PromqlParamNameContext = new PromqlParamNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 238, esql_parser.RULE_promqlParamName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1299;
			_la = this._input.LA(1);
			if(!(_la===66 || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & 193) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlParamValue(): PromqlParamValueContext {
		let localctx: PromqlParamValueContext = new PromqlParamValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, esql_parser.RULE_promqlParamValue);
		try {
			let _alt: number;
			this.state = 1311;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
			case 116:
			case 126:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1301;
				this.promqlIndexPattern();
				this.state = 1306;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 132, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1302;
						this.match(esql_parser.COMMA);
						this.state = 1303;
						this.promqlIndexPattern();
						}
						}
					}
					this.state = 1308;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 132, this._ctx);
				}
				}
				break;
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1309;
				this.match(esql_parser.QUOTED_IDENTIFIER);
				}
				break;
			case 110:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1310;
				this.match(esql_parser.NAMED_OR_POSITIONAL_PARAM);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlQueryContent(): PromqlQueryContentContext {
		let localctx: PromqlQueryContentContext = new PromqlQueryContentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 242, esql_parser.RULE_promqlQueryContent);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1313;
			_la = this._input.LA(1);
			if(!(((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & 1441) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & 65729) !== 0) || ((((_la - 175)) & ~0x1F) === 0 && ((1 << (_la - 175)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlQueryPart(): PromqlQueryPartContext {
		let localctx: PromqlQueryPartContext = new PromqlQueryPartContext(this, this._ctx, this.state);
		this.enterRule(localctx, 244, esql_parser.RULE_promqlQueryPart);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1328;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 66:
			case 71:
			case 73:
			case 74:
			case 76:
			case 110:
			case 116:
			case 117:
			case 126:
			case 175:
			case 176:
			case 177:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1316;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 1315;
						this.promqlQueryContent();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 1318;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 134, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 114:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1320;
				this.match(esql_parser.LP);
				this.state = 1324;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & 1441) !== 0) || ((((_la - 110)) & ~0x1F) === 0 && ((1 << (_la - 110)) & 65745) !== 0) || ((((_la - 175)) & ~0x1F) === 0 && ((1 << (_la - 175)) & 7) !== 0)) {
					{
					{
					this.state = 1321;
					this.promqlQueryPart();
					}
					}
					this.state = 1326;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1327;
				this.match(esql_parser.RP);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlIndexPattern(): PromqlIndexPatternContext {
		let localctx: PromqlIndexPatternContext = new PromqlIndexPatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 246, esql_parser.RULE_promqlIndexPattern);
		try {
			this.state = 1339;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 137, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1330;
				this.promqlClusterString();
				this.state = 1331;
				this.match(esql_parser.COLON);
				this.state = 1332;
				this.promqlUnquotedIndexString();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1334;
				this.promqlUnquotedIndexString();
				this.state = 1335;
				this.match(esql_parser.CAST_OP);
				this.state = 1336;
				this.promqlSelectorString();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1338;
				this.promqlIndexString();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlClusterString(): PromqlClusterStringContext {
		let localctx: PromqlClusterStringContext = new PromqlClusterStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 248, esql_parser.RULE_promqlClusterString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1341;
			_la = this._input.LA(1);
			if(!(_la===116 || _la===126)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlSelectorString(): PromqlSelectorStringContext {
		let localctx: PromqlSelectorStringContext = new PromqlSelectorStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 250, esql_parser.RULE_promqlSelectorString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1343;
			_la = this._input.LA(1);
			if(!(_la===116 || _la===126)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlUnquotedIndexString(): PromqlUnquotedIndexStringContext {
		let localctx: PromqlUnquotedIndexStringContext = new PromqlUnquotedIndexStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 252, esql_parser.RULE_promqlUnquotedIndexString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1345;
			_la = this._input.LA(1);
			if(!(_la===116 || _la===126)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public promqlIndexString(): PromqlIndexStringContext {
		let localctx: PromqlIndexStringContext = new PromqlIndexStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, esql_parser.RULE_promqlIndexString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1347;
			_la = this._input.LA(1);
			if(!(_la===66 || _la===116 || _la===126)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 2:
			return this.query_sempred(localctx as QueryContext, predIndex);
		case 3:
			return this.sourceCommand_sempred(localctx as SourceCommandContext, predIndex);
		case 64:
			return this.forkSubQueryCommand_sempred(localctx as ForkSubQueryCommandContext, predIndex);
		case 94:
			return this.booleanExpression_sempred(localctx as BooleanExpressionContext, predIndex);
		case 98:
			return this.operatorExpression_sempred(localctx as OperatorExpressionContext, predIndex);
		case 99:
			return this.primaryExpression_sempred(localctx as PrimaryExpressionContext, predIndex);
		}
		return true;
	}
	private query_sempred(localctx: QueryContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private sourceCommand_sempred(localctx: SourceCommandContext, predIndex: number): boolean {
		switch (predIndex) {
		case 1:
			return EsqlCapabilities.Cap.EXTERNAL_COMMAND.isEnabled();
		}
		return true;
	}
	private forkSubQueryCommand_sempred(localctx: ForkSubQueryCommandContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private booleanExpression_sempred(localctx: BooleanExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 3:
			return this.precpred(this._ctx, 7);
		case 4:
			return this.precpred(this._ctx, 6);
		}
		return true;
	}
	private operatorExpression_sempred(localctx: OperatorExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 5:
			return this.precpred(this._ctx, 2);
		case 6:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private primaryExpression_sempred(localctx: PrimaryExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 7:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,188,1350,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,2,121,
	7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,2,127,
	7,127,1,0,5,0,258,8,0,10,0,12,0,261,9,0,1,0,5,0,264,8,0,10,0,12,0,267,9,
	0,1,0,1,0,1,0,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,2,1,2,5,2,281,8,2,10,2,12,2,
	284,9,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,294,8,3,1,4,1,4,1,4,1,4,1,4,
	1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,
	1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,330,8,4,1,5,1,5,1,5,1,6,
	1,6,1,7,1,7,1,7,1,8,1,8,1,8,5,8,343,8,8,10,8,12,8,346,9,8,1,9,1,9,1,9,3,
	9,351,8,9,1,9,1,9,1,10,1,10,1,10,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,13,
	1,13,1,13,5,13,368,8,13,10,13,12,13,371,9,13,1,13,3,13,374,8,13,1,14,1,
	14,3,14,378,8,14,1,15,1,15,1,15,1,15,5,15,384,8,15,10,15,12,15,387,9,15,
	1,15,1,15,1,16,1,16,1,16,3,16,394,8,16,1,17,1,17,1,17,3,17,399,8,17,1,17,
	1,17,1,17,3,17,404,8,17,1,17,3,17,407,8,17,1,18,1,18,1,19,1,19,1,20,1,20,
	1,21,1,21,1,22,1,22,1,22,1,22,5,22,421,8,22,10,22,12,22,424,9,22,1,23,1,
	23,1,23,1,24,1,24,3,24,431,8,24,1,24,1,24,3,24,435,8,24,1,25,1,25,1,25,
	5,25,440,8,25,10,25,12,25,443,9,25,1,26,1,26,1,26,3,26,448,8,26,1,27,1,
	27,3,27,452,8,27,1,27,1,27,1,27,1,27,1,27,1,27,1,27,3,27,461,8,27,1,28,
	1,28,1,28,5,28,466,8,28,10,28,12,28,469,9,28,1,29,1,29,3,29,473,8,29,1,
	29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,482,8,29,1,30,1,30,1,30,5,30,487,
	8,30,10,30,12,30,490,9,30,1,31,1,31,1,31,5,31,495,8,31,10,31,12,31,498,
	9,31,1,32,1,32,1,33,1,33,1,33,1,33,3,33,506,8,33,1,34,3,34,509,8,34,1,34,
	1,34,1,34,5,34,514,8,34,10,34,12,34,517,9,34,1,34,3,34,520,8,34,1,35,1,
	35,3,35,524,8,35,1,36,1,36,3,36,528,8,36,1,37,1,37,1,37,3,37,533,8,37,1,
	38,1,38,3,38,537,8,38,1,39,1,39,1,39,3,39,542,8,39,1,40,1,40,1,40,1,40,
	5,40,548,8,40,10,40,12,40,551,9,40,1,41,1,41,1,41,1,41,5,41,557,8,41,10,
	41,12,41,560,9,41,1,42,1,42,3,42,564,8,42,1,42,1,42,3,42,568,8,42,1,43,
	1,43,1,43,1,44,1,44,1,44,1,45,1,45,1,45,1,45,5,45,580,8,45,10,45,12,45,
	583,9,45,1,46,1,46,1,46,1,46,1,46,1,46,1,46,1,46,3,46,593,8,46,1,47,1,47,
	1,47,1,47,3,47,599,8,47,1,48,1,48,1,48,5,48,604,8,48,10,48,12,48,607,9,
	48,1,49,1,49,1,49,1,49,1,50,1,50,3,50,615,8,50,1,51,1,51,1,51,1,51,1,51,
	5,51,622,8,51,10,51,12,51,625,9,51,1,52,1,52,1,52,1,53,1,53,1,53,1,54,1,
	54,1,54,1,54,1,55,1,55,1,55,1,56,1,56,1,56,1,56,3,56,644,8,56,1,56,1,56,
	1,56,1,56,5,56,650,8,56,10,56,12,56,653,9,56,3,56,655,8,56,1,57,1,57,1,
	58,1,58,1,58,3,58,662,8,58,1,58,1,58,1,59,1,59,1,59,1,60,1,60,1,60,1,60,
	3,60,673,8,60,1,60,1,60,1,60,1,60,1,60,3,60,680,8,60,1,60,1,60,1,60,1,60,
	5,60,686,8,60,10,60,12,60,689,9,60,3,60,691,8,60,1,61,1,61,1,61,1,62,4,
	62,697,8,62,11,62,12,62,698,1,63,1,63,1,63,1,63,1,64,1,64,1,64,1,64,1,64,
	1,64,5,64,711,8,64,10,64,12,64,714,9,64,1,65,1,65,1,66,1,66,1,66,1,66,3,
	66,722,8,66,1,66,1,66,1,66,1,66,1,66,1,67,1,67,1,67,1,67,3,67,733,8,67,
	1,67,1,67,1,67,1,68,1,68,1,68,1,68,1,68,3,68,743,8,68,1,68,1,68,1,68,1,
	68,3,68,749,8,68,3,68,751,8,68,1,69,1,69,3,69,755,8,69,1,69,5,69,758,8,
	69,10,69,12,69,761,9,69,1,70,1,70,1,70,1,70,1,70,1,70,1,70,1,70,1,70,1,
	70,1,70,3,70,774,8,70,1,71,1,71,1,71,5,71,779,8,71,10,71,12,71,782,9,71,
	1,72,1,72,1,73,1,73,1,74,1,74,1,75,1,75,1,76,1,76,1,76,1,76,1,76,1,77,1,
	77,1,78,1,78,1,78,1,78,1,78,3,78,804,8,78,1,78,3,78,807,8,78,1,78,1,78,
	3,78,811,8,78,1,78,1,78,1,79,1,79,1,79,5,79,818,8,79,10,79,12,79,821,9,
	79,1,80,1,80,1,80,1,80,1,80,1,81,1,81,1,81,1,81,1,81,1,81,1,81,3,81,835,
	8,81,1,82,1,82,1,82,1,82,1,82,1,83,1,83,1,83,1,83,1,83,1,84,1,84,1,84,1,
	84,1,84,1,84,1,85,1,85,1,85,1,85,1,85,1,85,1,86,1,86,1,86,1,86,1,87,1,87,
	1,87,1,87,3,87,867,8,87,1,88,1,88,1,88,1,88,1,89,1,89,1,89,1,89,1,90,1,
	90,3,90,879,8,90,1,90,1,90,1,90,1,90,1,90,1,90,1,91,1,91,3,91,889,8,91,
	1,92,1,92,3,92,893,8,92,1,92,3,92,896,8,92,1,92,1,92,1,93,1,93,1,93,1,93,
	1,93,1,93,1,93,1,93,1,93,1,93,1,93,3,93,911,8,93,1,93,3,93,914,8,93,1,94,
	1,94,1,94,1,94,1,94,1,94,1,94,3,94,923,8,94,1,94,1,94,1,94,1,94,1,94,5,
	94,930,8,94,10,94,12,94,933,9,94,1,94,1,94,1,94,1,94,1,94,1,94,4,94,941,
	8,94,11,94,12,94,942,1,94,1,94,3,94,947,8,94,1,94,1,94,1,94,1,94,1,94,3,
	94,954,8,94,1,94,1,94,1,94,1,94,1,94,1,94,3,94,962,8,94,1,94,1,94,1,94,
	3,94,967,8,94,1,94,1,94,1,94,1,94,1,94,1,94,5,94,975,8,94,10,94,12,94,978,
	9,94,1,95,1,95,3,95,982,8,95,1,95,1,95,1,95,1,95,1,95,3,95,989,8,95,1,95,
	1,95,1,95,1,95,1,95,3,95,996,8,95,1,95,1,95,1,95,1,95,1,95,5,95,1003,8,
	95,10,95,12,95,1006,9,95,1,95,1,95,1,95,1,95,3,95,1012,8,95,1,95,1,95,1,
	95,1,95,1,95,5,95,1019,8,95,10,95,12,95,1022,9,95,1,95,1,95,3,95,1026,8,
	95,1,96,1,96,1,96,1,96,1,97,1,97,1,97,1,97,1,97,3,97,1037,8,97,1,98,1,98,
	1,98,1,98,3,98,1043,8,98,1,98,1,98,1,98,1,98,1,98,1,98,5,98,1051,8,98,10,
	98,12,98,1054,9,98,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,3,99,1064,8,
	99,1,99,1,99,1,99,5,99,1069,8,99,10,99,12,99,1072,9,99,1,100,1,100,1,100,
	1,100,1,100,3,100,1079,8,100,1,100,1,100,1,100,3,100,1084,8,100,5,100,1086,
	8,100,10,100,12,100,1089,9,100,1,100,1,100,3,100,1093,8,100,3,100,1095,
	8,100,1,100,1,100,1,101,1,101,1,101,3,101,1102,8,101,1,102,1,102,1,102,
	1,102,5,102,1108,8,102,10,102,12,102,1111,9,102,3,102,1113,8,102,1,102,
	1,102,1,102,1,102,1,102,1,102,1,102,3,102,1122,8,102,1,103,1,103,1,103,
	1,103,5,103,1128,8,103,10,103,12,103,1131,9,103,3,103,1133,8,103,1,103,
	1,103,1,104,1,104,1,104,1,104,1,105,1,105,3,105,1143,8,105,1,106,1,106,
	1,106,1,106,1,106,1,106,1,106,1,106,1,106,1,106,1,106,1,106,1,106,5,106,
	1158,8,106,10,106,12,106,1161,9,106,1,106,1,106,1,106,1,106,1,106,1,106,
	5,106,1169,8,106,10,106,12,106,1172,9,106,1,106,1,106,1,106,1,106,1,106,
	1,106,5,106,1180,8,106,10,106,12,106,1183,9,106,1,106,1,106,3,106,1187,
	8,106,1,107,1,107,1,108,1,108,3,108,1193,8,108,1,109,3,109,1196,8,109,1,
	109,1,109,1,110,3,110,1201,8,110,1,110,1,110,1,111,1,111,1,112,1,112,1,
	113,1,113,1,113,1,113,1,113,1,114,1,114,3,114,1216,8,114,1,114,1,114,1,
	114,3,114,1221,8,114,1,115,1,115,1,115,1,115,5,115,1227,8,115,10,115,12,
	115,1230,9,115,1,116,1,116,5,116,1234,8,116,10,116,12,116,1237,9,116,1,
	116,1,116,1,116,3,116,1242,8,116,1,116,1,116,1,116,1,116,1,116,5,116,1249,
	8,116,10,116,12,116,1252,9,116,1,116,1,116,1,116,3,116,1257,8,116,1,116,
	1,116,1,116,5,116,1262,8,116,10,116,12,116,1265,9,116,1,116,1,116,1,116,
	3,116,1270,8,116,1,116,1,116,4,116,1274,8,116,11,116,12,116,1275,1,116,
	1,116,1,116,1,116,5,116,1282,8,116,10,116,12,116,1285,9,116,1,116,4,116,
	1288,8,116,11,116,12,116,1289,3,116,1292,8,116,1,117,1,117,1,118,1,118,
	1,118,1,118,1,119,1,119,1,120,1,120,1,120,5,120,1305,8,120,10,120,12,120,
	1308,9,120,1,120,1,120,3,120,1312,8,120,1,121,1,121,1,122,4,122,1317,8,
	122,11,122,12,122,1318,1,122,1,122,5,122,1323,8,122,10,122,12,122,1326,
	9,122,1,122,3,122,1329,8,122,1,123,1,123,1,123,1,123,1,123,1,123,1,123,
	1,123,1,123,3,123,1340,8,123,1,124,1,124,1,125,1,125,1,126,1,126,1,127,
	1,127,1,127,0,5,4,128,188,196,198,128,0,2,4,6,8,10,12,14,16,18,20,22,24,
	26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,
	74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,
	116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146,148,150,
	152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,182,184,186,
	188,190,192,194,196,198,200,202,204,206,208,210,212,214,216,218,220,222,
	224,226,228,230,232,234,236,238,240,242,244,246,248,250,252,254,0,14,2,
	0,66,66,126,126,1,0,116,117,2,0,70,70,77,77,2,0,80,80,83,83,2,0,55,55,66,
	66,1,0,101,102,1,0,103,105,2,0,79,79,92,92,2,0,94,94,96,100,2,0,38,38,40,
	41,3,0,66,66,110,110,116,117,8,0,66,66,71,71,73,74,76,76,110,110,116,117,
	126,126,175,177,2,0,116,116,126,126,3,0,66,66,116,116,126,126,1432,0,259,
	1,0,0,0,2,271,1,0,0,0,4,274,1,0,0,0,6,293,1,0,0,0,8,329,1,0,0,0,10,331,
	1,0,0,0,12,334,1,0,0,0,14,336,1,0,0,0,16,339,1,0,0,0,18,350,1,0,0,0,20,
	354,1,0,0,0,22,357,1,0,0,0,24,360,1,0,0,0,26,364,1,0,0,0,28,377,1,0,0,0,
	30,379,1,0,0,0,32,393,1,0,0,0,34,406,1,0,0,0,36,408,1,0,0,0,38,410,1,0,
	0,0,40,412,1,0,0,0,42,414,1,0,0,0,44,416,1,0,0,0,46,425,1,0,0,0,48,428,
	1,0,0,0,50,436,1,0,0,0,52,444,1,0,0,0,54,460,1,0,0,0,56,462,1,0,0,0,58,
	481,1,0,0,0,60,483,1,0,0,0,62,491,1,0,0,0,64,499,1,0,0,0,66,505,1,0,0,0,
	68,519,1,0,0,0,70,523,1,0,0,0,72,527,1,0,0,0,74,532,1,0,0,0,76,536,1,0,
	0,0,78,538,1,0,0,0,80,543,1,0,0,0,82,552,1,0,0,0,84,561,1,0,0,0,86,569,
	1,0,0,0,88,572,1,0,0,0,90,575,1,0,0,0,92,592,1,0,0,0,94,594,1,0,0,0,96,
	600,1,0,0,0,98,608,1,0,0,0,100,614,1,0,0,0,102,616,1,0,0,0,104,626,1,0,
	0,0,106,629,1,0,0,0,108,632,1,0,0,0,110,636,1,0,0,0,112,639,1,0,0,0,114,
	656,1,0,0,0,116,661,1,0,0,0,118,665,1,0,0,0,120,668,1,0,0,0,122,692,1,0,
	0,0,124,696,1,0,0,0,126,700,1,0,0,0,128,704,1,0,0,0,130,715,1,0,0,0,132,
	717,1,0,0,0,134,728,1,0,0,0,136,750,1,0,0,0,138,752,1,0,0,0,140,773,1,0,
	0,0,142,775,1,0,0,0,144,783,1,0,0,0,146,785,1,0,0,0,148,787,1,0,0,0,150,
	789,1,0,0,0,152,791,1,0,0,0,154,796,1,0,0,0,156,798,1,0,0,0,158,814,1,0,
	0,0,160,822,1,0,0,0,162,834,1,0,0,0,164,836,1,0,0,0,166,841,1,0,0,0,168,
	846,1,0,0,0,170,852,1,0,0,0,172,858,1,0,0,0,174,862,1,0,0,0,176,868,1,0,
	0,0,178,872,1,0,0,0,180,876,1,0,0,0,182,888,1,0,0,0,184,890,1,0,0,0,186,
	913,1,0,0,0,188,966,1,0,0,0,190,1025,1,0,0,0,192,1027,1,0,0,0,194,1036,
	1,0,0,0,196,1042,1,0,0,0,198,1063,1,0,0,0,200,1073,1,0,0,0,202,1101,1,0,
	0,0,204,1121,1,0,0,0,206,1123,1,0,0,0,208,1136,1,0,0,0,210,1142,1,0,0,0,
	212,1186,1,0,0,0,214,1188,1,0,0,0,216,1192,1,0,0,0,218,1195,1,0,0,0,220,
	1200,1,0,0,0,222,1204,1,0,0,0,224,1206,1,0,0,0,226,1208,1,0,0,0,228,1220,
	1,0,0,0,230,1222,1,0,0,0,232,1291,1,0,0,0,234,1293,1,0,0,0,236,1295,1,0,
	0,0,238,1299,1,0,0,0,240,1311,1,0,0,0,242,1313,1,0,0,0,244,1328,1,0,0,0,
	246,1339,1,0,0,0,248,1341,1,0,0,0,250,1343,1,0,0,0,252,1345,1,0,0,0,254,
	1347,1,0,0,0,256,258,3,172,86,0,257,256,1,0,0,0,258,261,1,0,0,0,259,257,
	1,0,0,0,259,260,1,0,0,0,260,265,1,0,0,0,261,259,1,0,0,0,262,264,3,176,88,
	0,263,262,1,0,0,0,264,267,1,0,0,0,265,263,1,0,0,0,265,266,1,0,0,0,266,268,
	1,0,0,0,267,265,1,0,0,0,268,269,3,2,1,0,269,270,5,0,0,1,270,1,1,0,0,0,271,
	272,3,4,2,0,272,273,5,0,0,1,273,3,1,0,0,0,274,275,6,2,-1,0,275,276,3,6,
	3,0,276,282,1,0,0,0,277,278,10,1,0,0,278,279,5,65,0,0,279,281,3,8,4,0,280,
	277,1,0,0,0,281,284,1,0,0,0,282,280,1,0,0,0,282,283,1,0,0,0,283,5,1,0,0,
	0,284,282,1,0,0,0,285,294,3,20,10,0,286,294,3,14,7,0,287,294,3,110,55,0,
	288,294,3,22,11,0,289,294,3,232,116,0,290,294,3,106,53,0,291,292,4,3,1,
	0,292,294,3,24,12,0,293,285,1,0,0,0,293,286,1,0,0,0,293,287,1,0,0,0,293,
	288,1,0,0,0,293,289,1,0,0,0,293,290,1,0,0,0,293,291,1,0,0,0,294,7,1,0,0,
	0,295,330,3,46,23,0,296,330,3,10,5,0,297,330,3,86,43,0,298,330,3,78,39,
	0,299,330,3,48,24,0,300,330,3,82,41,0,301,330,3,88,44,0,302,330,3,90,45,
	0,303,330,3,94,47,0,304,330,3,102,51,0,305,330,3,112,56,0,306,330,3,104,
	52,0,307,330,3,226,113,0,308,330,3,120,60,0,309,330,3,134,67,0,310,330,
	3,118,59,0,311,330,3,122,61,0,312,330,3,132,66,0,313,330,3,136,68,0,314,
	330,3,138,69,0,315,330,3,164,82,0,316,330,3,144,72,0,317,330,3,166,83,0,
	318,330,3,146,73,0,319,330,3,168,84,0,320,330,3,148,74,0,321,330,3,170,
	85,0,322,330,3,180,90,0,323,330,3,156,78,0,324,330,3,184,92,0,325,330,3,
	152,76,0,326,330,3,154,77,0,327,330,3,160,80,0,328,330,3,150,75,0,329,295,
	1,0,0,0,329,296,1,0,0,0,329,297,1,0,0,0,329,298,1,0,0,0,329,299,1,0,0,0,
	329,300,1,0,0,0,329,301,1,0,0,0,329,302,1,0,0,0,329,303,1,0,0,0,329,304,
	1,0,0,0,329,305,1,0,0,0,329,306,1,0,0,0,329,307,1,0,0,0,329,308,1,0,0,0,
	329,309,1,0,0,0,329,310,1,0,0,0,329,311,1,0,0,0,329,312,1,0,0,0,329,313,
	1,0,0,0,329,314,1,0,0,0,329,315,1,0,0,0,329,316,1,0,0,0,329,317,1,0,0,0,
	329,318,1,0,0,0,329,319,1,0,0,0,329,320,1,0,0,0,329,321,1,0,0,0,329,322,
	1,0,0,0,329,323,1,0,0,0,329,324,1,0,0,0,329,325,1,0,0,0,329,326,1,0,0,0,
	329,327,1,0,0,0,329,328,1,0,0,0,330,9,1,0,0,0,331,332,5,19,0,0,332,333,
	3,188,94,0,333,11,1,0,0,0,334,335,3,64,32,0,335,13,1,0,0,0,336,337,5,15,
	0,0,337,338,3,16,8,0,338,15,1,0,0,0,339,344,3,18,9,0,340,341,5,76,0,0,341,
	343,3,18,9,0,342,340,1,0,0,0,343,346,1,0,0,0,344,342,1,0,0,0,344,345,1,
	0,0,0,345,17,1,0,0,0,346,344,1,0,0,0,347,348,3,54,27,0,348,349,5,71,0,0,
	349,351,1,0,0,0,350,347,1,0,0,0,350,351,1,0,0,0,351,352,1,0,0,0,352,353,
	3,188,94,0,353,19,1,0,0,0,354,355,5,29,0,0,355,356,3,26,13,0,356,21,1,0,
	0,0,357,358,5,30,0,0,358,359,3,26,13,0,359,23,1,0,0,0,360,361,5,31,0,0,
	361,362,3,76,38,0,362,363,3,100,50,0,363,25,1,0,0,0,364,369,3,28,14,0,365,
	366,5,76,0,0,366,368,3,28,14,0,367,365,1,0,0,0,368,371,1,0,0,0,369,367,
	1,0,0,0,369,370,1,0,0,0,370,373,1,0,0,0,371,369,1,0,0,0,372,374,3,44,22,
	0,373,372,1,0,0,0,373,374,1,0,0,0,374,27,1,0,0,0,375,378,3,34,17,0,376,
	378,3,30,15,0,377,375,1,0,0,0,377,376,1,0,0,0,378,29,1,0,0,0,379,380,5,
	114,0,0,380,385,3,32,16,0,381,382,5,65,0,0,382,384,3,8,4,0,383,381,1,0,
	0,0,384,387,1,0,0,0,385,383,1,0,0,0,385,386,1,0,0,0,386,388,1,0,0,0,387,
	385,1,0,0,0,388,389,5,115,0,0,389,31,1,0,0,0,390,394,3,20,10,0,391,394,
	3,14,7,0,392,394,3,22,11,0,393,390,1,0,0,0,393,391,1,0,0,0,393,392,1,0,
	0,0,394,33,1,0,0,0,395,396,3,36,18,0,396,397,5,74,0,0,397,399,1,0,0,0,398,
	395,1,0,0,0,398,399,1,0,0,0,399,400,1,0,0,0,400,403,3,40,20,0,401,402,5,
	73,0,0,402,404,3,38,19,0,403,401,1,0,0,0,403,404,1,0,0,0,404,407,1,0,0,
	0,405,407,3,42,21,0,406,398,1,0,0,0,406,405,1,0,0,0,407,35,1,0,0,0,408,
	409,5,126,0,0,409,37,1,0,0,0,410,411,5,126,0,0,411,39,1,0,0,0,412,413,5,
	126,0,0,413,41,1,0,0,0,414,415,7,0,0,0,415,43,1,0,0,0,416,417,5,125,0,0,
	417,422,5,126,0,0,418,419,5,76,0,0,419,421,5,126,0,0,420,418,1,0,0,0,421,
	424,1,0,0,0,422,420,1,0,0,0,422,423,1,0,0,0,423,45,1,0,0,0,424,422,1,0,
	0,0,425,426,5,11,0,0,426,427,3,16,8,0,427,47,1,0,0,0,428,430,5,18,0,0,429,
	431,3,50,25,0,430,429,1,0,0,0,430,431,1,0,0,0,431,434,1,0,0,0,432,433,5,
	72,0,0,433,435,3,16,8,0,434,432,1,0,0,0,434,435,1,0,0,0,435,49,1,0,0,0,
	436,441,3,52,26,0,437,438,5,76,0,0,438,440,3,52,26,0,439,437,1,0,0,0,440,
	443,1,0,0,0,441,439,1,0,0,0,441,442,1,0,0,0,442,51,1,0,0,0,443,441,1,0,
	0,0,444,447,3,18,9,0,445,446,5,19,0,0,446,448,3,188,94,0,447,445,1,0,0,
	0,447,448,1,0,0,0,448,53,1,0,0,0,449,451,5,112,0,0,450,452,5,116,0,0,451,
	450,1,0,0,0,451,452,1,0,0,0,452,453,1,0,0,0,453,454,5,113,0,0,454,455,5,
	78,0,0,455,456,5,112,0,0,456,457,3,56,28,0,457,458,5,113,0,0,458,461,1,
	0,0,0,459,461,3,56,28,0,460,449,1,0,0,0,460,459,1,0,0,0,461,55,1,0,0,0,
	462,467,3,74,37,0,463,464,5,78,0,0,464,466,3,74,37,0,465,463,1,0,0,0,466,
	469,1,0,0,0,467,465,1,0,0,0,467,468,1,0,0,0,468,57,1,0,0,0,469,467,1,0,
	0,0,470,472,5,112,0,0,471,473,5,168,0,0,472,471,1,0,0,0,472,473,1,0,0,0,
	473,474,1,0,0,0,474,475,5,113,0,0,475,476,5,78,0,0,476,477,5,112,0,0,477,
	478,3,60,30,0,478,479,5,113,0,0,479,482,1,0,0,0,480,482,3,60,30,0,481,470,
	1,0,0,0,481,480,1,0,0,0,482,59,1,0,0,0,483,488,3,66,33,0,484,485,5,78,0,
	0,485,487,3,66,33,0,486,484,1,0,0,0,487,490,1,0,0,0,488,486,1,0,0,0,488,
	489,1,0,0,0,489,61,1,0,0,0,490,488,1,0,0,0,491,496,3,58,29,0,492,493,5,
	76,0,0,493,495,3,58,29,0,494,492,1,0,0,0,495,498,1,0,0,0,496,494,1,0,0,
	0,496,497,1,0,0,0,497,63,1,0,0,0,498,496,1,0,0,0,499,500,7,1,0,0,500,65,
	1,0,0,0,501,506,5,168,0,0,502,506,3,68,34,0,503,506,3,70,35,0,504,506,3,
	72,36,0,505,501,1,0,0,0,505,502,1,0,0,0,505,503,1,0,0,0,505,504,1,0,0,0,
	506,67,1,0,0,0,507,509,3,64,32,0,508,507,1,0,0,0,508,509,1,0,0,0,509,510,
	1,0,0,0,510,515,5,103,0,0,511,514,3,64,32,0,512,514,5,103,0,0,513,511,1,
	0,0,0,513,512,1,0,0,0,514,517,1,0,0,0,515,513,1,0,0,0,515,516,1,0,0,0,516,
	520,1,0,0,0,517,515,1,0,0,0,518,520,3,64,32,0,519,508,1,0,0,0,519,518,1,
	0,0,0,520,69,1,0,0,0,521,524,5,90,0,0,522,524,5,110,0,0,523,521,1,0,0,0,
	523,522,1,0,0,0,524,71,1,0,0,0,525,528,5,109,0,0,526,528,5,111,0,0,527,
	525,1,0,0,0,527,526,1,0,0,0,528,73,1,0,0,0,529,533,3,64,32,0,530,533,3,
	70,35,0,531,533,3,72,36,0,532,529,1,0,0,0,532,530,1,0,0,0,532,531,1,0,0,
	0,533,75,1,0,0,0,534,537,3,222,111,0,535,537,3,70,35,0,536,534,1,0,0,0,
	536,535,1,0,0,0,537,77,1,0,0,0,538,539,5,13,0,0,539,541,3,212,106,0,540,
	542,3,80,40,0,541,540,1,0,0,0,541,542,1,0,0,0,542,79,1,0,0,0,543,544,5,
	72,0,0,544,549,3,188,94,0,545,546,5,76,0,0,546,548,3,188,94,0,547,545,1,
	0,0,0,548,551,1,0,0,0,549,547,1,0,0,0,549,550,1,0,0,0,550,81,1,0,0,0,551,
	549,1,0,0,0,552,553,5,17,0,0,553,558,3,84,42,0,554,555,5,76,0,0,555,557,
	3,84,42,0,556,554,1,0,0,0,557,560,1,0,0,0,558,556,1,0,0,0,558,559,1,0,0,
	0,559,83,1,0,0,0,560,558,1,0,0,0,561,563,3,188,94,0,562,564,7,2,0,0,563,
	562,1,0,0,0,563,564,1,0,0,0,564,567,1,0,0,0,565,566,5,87,0,0,566,568,7,
	3,0,0,567,565,1,0,0,0,567,568,1,0,0,0,568,85,1,0,0,0,569,570,5,46,0,0,570,
	571,3,62,31,0,571,87,1,0,0,0,572,573,5,45,0,0,573,574,3,62,31,0,574,89,
	1,0,0,0,575,576,5,48,0,0,576,581,3,92,46,0,577,578,5,76,0,0,578,580,3,92,
	46,0,579,577,1,0,0,0,580,583,1,0,0,0,581,579,1,0,0,0,581,582,1,0,0,0,582,
	91,1,0,0,0,583,581,1,0,0,0,584,585,3,58,29,0,585,586,5,178,0,0,586,587,
	3,58,29,0,587,593,1,0,0,0,588,589,3,58,29,0,589,590,5,71,0,0,590,591,3,
	58,29,0,591,593,1,0,0,0,592,584,1,0,0,0,592,588,1,0,0,0,593,93,1,0,0,0,
	594,595,5,10,0,0,595,596,3,198,99,0,596,598,3,222,111,0,597,599,3,96,48,
	0,598,597,1,0,0,0,598,599,1,0,0,0,599,95,1,0,0,0,600,605,3,98,49,0,601,
	602,5,76,0,0,602,604,3,98,49,0,603,601,1,0,0,0,604,607,1,0,0,0,605,603,
	1,0,0,0,605,606,1,0,0,0,606,97,1,0,0,0,607,605,1,0,0,0,608,609,3,64,32,
	0,609,610,5,71,0,0,610,611,3,212,106,0,611,99,1,0,0,0,612,613,5,93,0,0,
	613,615,3,206,103,0,614,612,1,0,0,0,614,615,1,0,0,0,615,101,1,0,0,0,616,
	617,5,12,0,0,617,618,3,198,99,0,618,623,3,222,111,0,619,620,5,76,0,0,620,
	622,3,222,111,0,621,619,1,0,0,0,622,625,1,0,0,0,623,621,1,0,0,0,623,624,
	1,0,0,0,624,103,1,0,0,0,625,623,1,0,0,0,626,627,5,44,0,0,627,628,3,54,27,
	0,628,105,1,0,0,0,629,630,5,8,0,0,630,631,3,108,54,0,631,107,1,0,0,0,632,
	633,5,114,0,0,633,634,3,4,2,0,634,635,5,115,0,0,635,109,1,0,0,0,636,637,
	5,50,0,0,637,638,5,185,0,0,638,111,1,0,0,0,639,640,5,7,0,0,640,643,3,114,
	57,0,641,642,5,88,0,0,642,644,3,58,29,0,643,641,1,0,0,0,643,644,1,0,0,0,
	644,654,1,0,0,0,645,646,5,93,0,0,646,651,3,116,58,0,647,648,5,76,0,0,648,
	650,3,116,58,0,649,647,1,0,0,0,650,653,1,0,0,0,651,649,1,0,0,0,651,652,
	1,0,0,0,652,655,1,0,0,0,653,651,1,0,0,0,654,645,1,0,0,0,654,655,1,0,0,0,
	655,113,1,0,0,0,656,657,7,4,0,0,657,115,1,0,0,0,658,659,3,58,29,0,659,660,
	5,71,0,0,660,662,1,0,0,0,661,658,1,0,0,0,661,662,1,0,0,0,662,663,1,0,0,
	0,663,664,3,58,29,0,664,117,1,0,0,0,665,666,5,16,0,0,666,667,3,212,106,
	0,667,119,1,0,0,0,668,669,5,4,0,0,669,672,3,54,27,0,670,671,5,88,0,0,671,
	673,3,54,27,0,672,670,1,0,0,0,672,673,1,0,0,0,673,679,1,0,0,0,674,675,5,
	178,0,0,675,676,3,54,27,0,676,677,5,76,0,0,677,678,3,54,27,0,678,680,1,
	0,0,0,679,674,1,0,0,0,679,680,1,0,0,0,680,690,1,0,0,0,681,682,5,72,0,0,
	682,687,3,188,94,0,683,684,5,76,0,0,684,686,3,188,94,0,685,683,1,0,0,0,
	686,689,1,0,0,0,687,685,1,0,0,0,687,688,1,0,0,0,688,691,1,0,0,0,689,687,
	1,0,0,0,690,681,1,0,0,0,690,691,1,0,0,0,691,121,1,0,0,0,692,693,5,32,0,
	0,693,694,3,124,62,0,694,123,1,0,0,0,695,697,3,126,63,0,696,695,1,0,0,0,
	697,698,1,0,0,0,698,696,1,0,0,0,698,699,1,0,0,0,699,125,1,0,0,0,700,701,
	5,114,0,0,701,702,3,128,64,0,702,703,5,115,0,0,703,127,1,0,0,0,704,705,
	6,64,-1,0,705,706,3,130,65,0,706,712,1,0,0,0,707,708,10,1,0,0,708,709,5,
	65,0,0,709,711,3,130,65,0,710,707,1,0,0,0,711,714,1,0,0,0,712,710,1,0,0,
	0,712,713,1,0,0,0,713,129,1,0,0,0,714,712,1,0,0,0,715,716,3,8,4,0,716,131,
	1,0,0,0,717,721,5,14,0,0,718,719,3,54,27,0,719,720,5,71,0,0,720,722,1,0,
	0,0,721,718,1,0,0,0,721,722,1,0,0,0,722,723,1,0,0,0,723,724,3,212,106,0,
	724,725,5,88,0,0,725,726,3,16,8,0,726,727,3,100,50,0,727,133,1,0,0,0,728,
	732,5,9,0,0,729,730,3,54,27,0,730,731,5,71,0,0,731,733,1,0,0,0,732,729,
	1,0,0,0,732,733,1,0,0,0,733,734,1,0,0,0,734,735,3,198,99,0,735,736,3,100,
	50,0,736,135,1,0,0,0,737,738,5,36,0,0,738,739,5,142,0,0,739,742,3,50,25,
	0,740,741,5,72,0,0,741,743,3,16,8,0,742,740,1,0,0,0,742,743,1,0,0,0,743,
	751,1,0,0,0,744,745,5,37,0,0,745,748,3,50,25,0,746,747,5,72,0,0,747,749,
	3,16,8,0,748,746,1,0,0,0,748,749,1,0,0,0,749,751,1,0,0,0,750,737,1,0,0,
	0,750,744,1,0,0,0,751,137,1,0,0,0,752,754,5,34,0,0,753,755,3,64,32,0,754,
	753,1,0,0,0,754,755,1,0,0,0,755,759,1,0,0,0,756,758,3,140,70,0,757,756,
	1,0,0,0,758,761,1,0,0,0,759,757,1,0,0,0,759,760,1,0,0,0,760,139,1,0,0,0,
	761,759,1,0,0,0,762,763,5,137,0,0,763,764,5,72,0,0,764,774,3,54,27,0,765,
	766,5,138,0,0,766,767,5,72,0,0,767,774,3,142,71,0,768,769,5,136,0,0,769,
	770,5,72,0,0,770,774,3,54,27,0,771,772,5,93,0,0,772,774,3,206,103,0,773,
	762,1,0,0,0,773,765,1,0,0,0,773,768,1,0,0,0,773,771,1,0,0,0,774,141,1,0,
	0,0,775,780,3,54,27,0,776,777,5,76,0,0,777,779,3,54,27,0,778,776,1,0,0,
	0,779,782,1,0,0,0,780,778,1,0,0,0,780,781,1,0,0,0,781,143,1,0,0,0,782,780,
	1,0,0,0,783,784,5,21,0,0,784,145,1,0,0,0,785,786,5,23,0,0,786,147,1,0,0,
	0,787,788,5,25,0,0,788,149,1,0,0,0,789,790,5,27,0,0,790,151,1,0,0,0,791,
	792,5,42,0,0,792,793,3,34,17,0,793,794,5,88,0,0,794,795,3,62,31,0,795,153,
	1,0,0,0,796,797,5,5,0,0,797,155,1,0,0,0,798,803,5,35,0,0,799,800,3,64,32,
	0,800,801,5,71,0,0,801,802,3,222,111,0,802,804,1,0,0,0,803,799,1,0,0,0,
	803,804,1,0,0,0,804,806,1,0,0,0,805,807,3,188,94,0,806,805,1,0,0,0,806,
	807,1,0,0,0,807,810,1,0,0,0,808,809,5,88,0,0,809,811,3,62,31,0,810,808,
	1,0,0,0,810,811,1,0,0,0,811,812,1,0,0,0,812,813,3,100,50,0,813,157,1,0,
	0,0,814,819,3,54,27,0,815,816,5,76,0,0,816,818,3,54,27,0,817,815,1,0,0,
	0,818,821,1,0,0,0,819,817,1,0,0,0,819,820,1,0,0,0,820,159,1,0,0,0,821,819,
	1,0,0,0,822,823,5,28,0,0,823,824,3,162,81,0,824,825,5,88,0,0,825,826,3,
	62,31,0,826,161,1,0,0,0,827,835,5,86,0,0,828,835,5,121,0,0,829,835,3,220,
	110,0,830,835,3,218,109,0,831,835,3,214,107,0,832,835,3,222,111,0,833,835,
	3,70,35,0,834,827,1,0,0,0,834,828,1,0,0,0,834,829,1,0,0,0,834,830,1,0,0,
	0,834,831,1,0,0,0,834,832,1,0,0,0,834,833,1,0,0,0,835,163,1,0,0,0,836,837,
	5,20,0,0,837,838,3,54,27,0,838,839,5,71,0,0,839,840,3,198,99,0,840,165,
	1,0,0,0,841,842,5,22,0,0,842,843,3,54,27,0,843,844,5,71,0,0,844,845,3,198,
	99,0,845,167,1,0,0,0,846,847,5,24,0,0,847,848,3,54,27,0,848,849,5,71,0,
	0,849,850,3,198,99,0,850,851,3,100,50,0,851,169,1,0,0,0,852,853,5,26,0,
	0,853,854,3,54,27,0,854,855,5,71,0,0,855,856,3,198,99,0,856,857,3,100,50,
	0,857,171,1,0,0,0,858,859,5,49,0,0,859,860,3,174,87,0,860,861,5,75,0,0,
	861,173,1,0,0,0,862,863,3,64,32,0,863,866,5,71,0,0,864,867,3,212,106,0,
	865,867,3,206,103,0,866,864,1,0,0,0,866,865,1,0,0,0,867,175,1,0,0,0,868,
	869,5,33,0,0,869,870,3,178,89,0,870,871,5,75,0,0,871,177,1,0,0,0,872,873,
	5,116,0,0,873,874,5,71,0,0,874,875,3,30,15,0,875,179,1,0,0,0,876,878,5,
	43,0,0,877,879,3,182,91,0,878,877,1,0,0,0,878,879,1,0,0,0,879,880,1,0,0,
	0,880,881,5,88,0,0,881,882,3,54,27,0,882,883,5,161,0,0,883,884,3,220,110,
	0,884,885,3,100,50,0,885,181,1,0,0,0,886,889,3,70,35,0,887,889,3,198,99,
	0,888,886,1,0,0,0,888,887,1,0,0,0,889,183,1,0,0,0,890,892,5,6,0,0,891,893,
	3,186,93,0,892,891,1,0,0,0,892,893,1,0,0,0,893,895,1,0,0,0,894,896,3,158,
	79,0,895,894,1,0,0,0,895,896,1,0,0,0,896,897,1,0,0,0,897,898,3,100,50,0,
	898,185,1,0,0,0,899,900,3,54,27,0,900,901,5,71,0,0,901,914,1,0,0,0,902,
	903,3,64,32,0,903,904,5,71,0,0,904,905,3,222,111,0,905,906,5,88,0,0,906,
	914,1,0,0,0,907,908,3,54,27,0,908,909,5,71,0,0,909,911,1,0,0,0,910,907,
	1,0,0,0,910,911,1,0,0,0,911,912,1,0,0,0,912,914,3,222,111,0,913,899,1,0,
	0,0,913,902,1,0,0,0,913,910,1,0,0,0,914,187,1,0,0,0,915,916,6,94,-1,0,916,
	917,5,85,0,0,917,967,3,188,94,10,918,967,3,194,97,0,919,967,3,190,95,0,
	920,922,3,194,97,0,921,923,5,85,0,0,922,921,1,0,0,0,922,923,1,0,0,0,923,
	924,1,0,0,0,924,925,5,81,0,0,925,926,5,114,0,0,926,931,3,194,97,0,927,928,
	5,76,0,0,928,930,3,194,97,0,929,927,1,0,0,0,930,933,1,0,0,0,931,929,1,0,
	0,0,931,932,1,0,0,0,932,934,1,0,0,0,933,931,1,0,0,0,934,935,5,115,0,0,935,
	967,1,0,0,0,936,937,5,114,0,0,937,940,3,194,97,0,938,939,5,76,0,0,939,941,
	3,194,97,0,940,938,1,0,0,0,941,942,1,0,0,0,942,940,1,0,0,0,942,943,1,0,
	0,0,943,944,1,0,0,0,944,946,5,115,0,0,945,947,5,85,0,0,946,945,1,0,0,0,
	946,947,1,0,0,0,947,948,1,0,0,0,948,949,5,81,0,0,949,950,3,30,15,0,950,
	967,1,0,0,0,951,953,3,194,97,0,952,954,5,85,0,0,953,952,1,0,0,0,953,954,
	1,0,0,0,954,955,1,0,0,0,955,956,5,81,0,0,956,957,3,30,15,0,957,967,1,0,
	0,0,958,959,3,194,97,0,959,961,5,82,0,0,960,962,5,85,0,0,961,960,1,0,0,
	0,961,962,1,0,0,0,962,963,1,0,0,0,963,964,5,86,0,0,964,967,1,0,0,0,965,
	967,3,192,96,0,966,915,1,0,0,0,966,918,1,0,0,0,966,919,1,0,0,0,966,920,
	1,0,0,0,966,936,1,0,0,0,966,951,1,0,0,0,966,958,1,0,0,0,966,965,1,0,0,0,
	967,976,1,0,0,0,968,969,10,7,0,0,969,970,5,69,0,0,970,975,3,188,94,8,971,
	972,10,6,0,0,972,973,5,89,0,0,973,975,3,188,94,7,974,968,1,0,0,0,974,971,
	1,0,0,0,975,978,1,0,0,0,976,974,1,0,0,0,976,977,1,0,0,0,977,189,1,0,0,0,
	978,976,1,0,0,0,979,981,3,194,97,0,980,982,5,85,0,0,981,980,1,0,0,0,981,
	982,1,0,0,0,982,983,1,0,0,0,983,984,5,84,0,0,984,985,3,198,99,0,985,1026,
	1,0,0,0,986,988,3,194,97,0,987,989,5,85,0,0,988,987,1,0,0,0,988,989,1,0,
	0,0,989,990,1,0,0,0,990,991,5,91,0,0,991,992,3,198,99,0,992,1026,1,0,0,
	0,993,995,3,194,97,0,994,996,5,85,0,0,995,994,1,0,0,0,995,996,1,0,0,0,996,
	997,1,0,0,0,997,998,5,84,0,0,998,999,5,114,0,0,999,1004,3,76,38,0,1000,
	1001,5,76,0,0,1001,1003,3,76,38,0,1002,1000,1,0,0,0,1003,1006,1,0,0,0,1004,
	1002,1,0,0,0,1004,1005,1,0,0,0,1005,1007,1,0,0,0,1006,1004,1,0,0,0,1007,
	1008,5,115,0,0,1008,1026,1,0,0,0,1009,1011,3,194,97,0,1010,1012,5,85,0,
	0,1011,1010,1,0,0,0,1011,1012,1,0,0,0,1012,1013,1,0,0,0,1013,1014,5,91,
	0,0,1014,1015,5,114,0,0,1015,1020,3,76,38,0,1016,1017,5,76,0,0,1017,1019,
	3,76,38,0,1018,1016,1,0,0,0,1019,1022,1,0,0,0,1020,1018,1,0,0,0,1020,1021,
	1,0,0,0,1021,1023,1,0,0,0,1022,1020,1,0,0,0,1023,1024,5,115,0,0,1024,1026,
	1,0,0,0,1025,979,1,0,0,0,1025,986,1,0,0,0,1025,993,1,0,0,0,1025,1009,1,
	0,0,0,1026,191,1,0,0,0,1027,1028,3,198,99,0,1028,1029,5,74,0,0,1029,1030,
	3,212,106,0,1030,193,1,0,0,0,1031,1037,3,196,98,0,1032,1033,3,196,98,0,
	1033,1034,3,224,112,0,1034,1035,3,196,98,0,1035,1037,1,0,0,0,1036,1031,
	1,0,0,0,1036,1032,1,0,0,0,1037,195,1,0,0,0,1038,1039,6,98,-1,0,1039,1043,
	3,198,99,0,1040,1041,7,5,0,0,1041,1043,3,196,98,3,1042,1038,1,0,0,0,1042,
	1040,1,0,0,0,1043,1052,1,0,0,0,1044,1045,10,2,0,0,1045,1046,7,6,0,0,1046,
	1051,3,196,98,3,1047,1048,10,1,0,0,1048,1049,7,5,0,0,1049,1051,3,196,98,
	2,1050,1044,1,0,0,0,1050,1047,1,0,0,0,1051,1054,1,0,0,0,1052,1050,1,0,0,
	0,1052,1053,1,0,0,0,1053,197,1,0,0,0,1054,1052,1,0,0,0,1055,1056,6,99,-1,
	0,1056,1064,3,212,106,0,1057,1064,3,54,27,0,1058,1064,3,200,100,0,1059,
	1060,5,114,0,0,1060,1061,3,188,94,0,1061,1062,5,115,0,0,1062,1064,1,0,0,
	0,1063,1055,1,0,0,0,1063,1057,1,0,0,0,1063,1058,1,0,0,0,1063,1059,1,0,0,
	0,1064,1070,1,0,0,0,1065,1066,10,1,0,0,1066,1067,5,73,0,0,1067,1069,3,12,
	6,0,1068,1065,1,0,0,0,1069,1072,1,0,0,0,1070,1068,1,0,0,0,1070,1071,1,0,
	0,0,1071,199,1,0,0,0,1072,1070,1,0,0,0,1073,1074,3,202,101,0,1074,1094,
	5,114,0,0,1075,1095,5,103,0,0,1076,1079,3,188,94,0,1077,1079,3,204,102,
	0,1078,1076,1,0,0,0,1078,1077,1,0,0,0,1079,1087,1,0,0,0,1080,1083,5,76,
	0,0,1081,1084,3,188,94,0,1082,1084,3,204,102,0,1083,1081,1,0,0,0,1083,1082,
	1,0,0,0,1084,1086,1,0,0,0,1085,1080,1,0,0,0,1086,1089,1,0,0,0,1087,1085,
	1,0,0,0,1087,1088,1,0,0,0,1088,1092,1,0,0,0,1089,1087,1,0,0,0,1090,1091,
	5,76,0,0,1091,1093,3,206,103,0,1092,1090,1,0,0,0,1092,1093,1,0,0,0,1093,
	1095,1,0,0,0,1094,1075,1,0,0,0,1094,1078,1,0,0,0,1094,1095,1,0,0,0,1095,
	1096,1,0,0,0,1096,1097,5,115,0,0,1097,201,1,0,0,0,1098,1102,3,74,37,0,1099,
	1102,5,80,0,0,1100,1102,5,83,0,0,1101,1098,1,0,0,0,1101,1099,1,0,0,0,1101,
	1100,1,0,0,0,1102,203,1,0,0,0,1103,1112,5,114,0,0,1104,1109,3,64,32,0,1105,
	1106,5,76,0,0,1106,1108,3,64,32,0,1107,1105,1,0,0,0,1108,1111,1,0,0,0,1109,
	1107,1,0,0,0,1109,1110,1,0,0,0,1110,1113,1,0,0,0,1111,1109,1,0,0,0,1112,
	1104,1,0,0,0,1112,1113,1,0,0,0,1113,1114,1,0,0,0,1114,1115,5,115,0,0,1115,
	1116,5,108,0,0,1116,1122,3,188,94,0,1117,1118,3,64,32,0,1118,1119,5,108,
	0,0,1119,1120,3,188,94,0,1120,1122,1,0,0,0,1121,1103,1,0,0,0,1121,1117,
	1,0,0,0,1122,205,1,0,0,0,1123,1132,5,106,0,0,1124,1129,3,208,104,0,1125,
	1126,5,76,0,0,1126,1128,3,208,104,0,1127,1125,1,0,0,0,1128,1131,1,0,0,0,
	1129,1127,1,0,0,0,1129,1130,1,0,0,0,1130,1133,1,0,0,0,1131,1129,1,0,0,0,
	1132,1124,1,0,0,0,1132,1133,1,0,0,0,1133,1134,1,0,0,0,1134,1135,5,107,0,
	0,1135,207,1,0,0,0,1136,1137,3,222,111,0,1137,1138,5,74,0,0,1138,1139,3,
	210,105,0,1139,209,1,0,0,0,1140,1143,3,212,106,0,1141,1143,3,206,103,0,
	1142,1140,1,0,0,0,1142,1141,1,0,0,0,1143,211,1,0,0,0,1144,1187,5,86,0,0,
	1145,1146,3,220,110,0,1146,1147,5,116,0,0,1147,1187,1,0,0,0,1148,1187,3,
	218,109,0,1149,1187,3,220,110,0,1150,1187,3,214,107,0,1151,1187,3,70,35,
	0,1152,1187,3,222,111,0,1153,1154,5,112,0,0,1154,1159,3,216,108,0,1155,
	1156,5,76,0,0,1156,1158,3,216,108,0,1157,1155,1,0,0,0,1158,1161,1,0,0,0,
	1159,1157,1,0,0,0,1159,1160,1,0,0,0,1160,1162,1,0,0,0,1161,1159,1,0,0,0,
	1162,1163,5,113,0,0,1163,1187,1,0,0,0,1164,1165,5,112,0,0,1165,1170,3,214,
	107,0,1166,1167,5,76,0,0,1167,1169,3,214,107,0,1168,1166,1,0,0,0,1169,1172,
	1,0,0,0,1170,1168,1,0,0,0,1170,1171,1,0,0,0,1171,1173,1,0,0,0,1172,1170,
	1,0,0,0,1173,1174,5,113,0,0,1174,1187,1,0,0,0,1175,1176,5,112,0,0,1176,
	1181,3,222,111,0,1177,1178,5,76,0,0,1178,1180,3,222,111,0,1179,1177,1,0,
	0,0,1180,1183,1,0,0,0,1181,1179,1,0,0,0,1181,1182,1,0,0,0,1182,1184,1,0,
	0,0,1183,1181,1,0,0,0,1184,1185,5,113,0,0,1185,1187,1,0,0,0,1186,1144,1,
	0,0,0,1186,1145,1,0,0,0,1186,1148,1,0,0,0,1186,1149,1,0,0,0,1186,1150,1,
	0,0,0,1186,1151,1,0,0,0,1186,1152,1,0,0,0,1186,1153,1,0,0,0,1186,1164,1,
	0,0,0,1186,1175,1,0,0,0,1187,213,1,0,0,0,1188,1189,7,7,0,0,1189,215,1,0,
	0,0,1190,1193,3,218,109,0,1191,1193,3,220,110,0,1192,1190,1,0,0,0,1192,
	1191,1,0,0,0,1193,217,1,0,0,0,1194,1196,7,5,0,0,1195,1194,1,0,0,0,1195,
	1196,1,0,0,0,1196,1197,1,0,0,0,1197,1198,5,68,0,0,1198,219,1,0,0,0,1199,
	1201,7,5,0,0,1200,1199,1,0,0,0,1200,1201,1,0,0,0,1201,1202,1,0,0,0,1202,
	1203,5,67,0,0,1203,221,1,0,0,0,1204,1205,5,66,0,0,1205,223,1,0,0,0,1206,
	1207,7,8,0,0,1207,225,1,0,0,0,1208,1209,7,9,0,0,1209,1210,5,150,0,0,1210,
	1211,3,228,114,0,1211,1212,3,230,115,0,1212,227,1,0,0,0,1213,1215,3,34,
	17,0,1214,1216,5,178,0,0,1215,1214,1,0,0,0,1215,1216,1,0,0,0,1216,1217,
	1,0,0,0,1217,1218,5,126,0,0,1218,1221,1,0,0,0,1219,1221,3,34,17,0,1220,
	1213,1,0,0,0,1220,1219,1,0,0,0,1221,229,1,0,0,0,1222,1223,5,88,0,0,1223,
	1228,3,188,94,0,1224,1225,5,76,0,0,1225,1227,3,188,94,0,1226,1224,1,0,0,
	0,1227,1230,1,0,0,0,1228,1226,1,0,0,0,1228,1229,1,0,0,0,1229,231,1,0,0,
	0,1230,1228,1,0,0,0,1231,1235,5,47,0,0,1232,1234,3,236,118,0,1233,1232,
	1,0,0,0,1234,1237,1,0,0,0,1235,1233,1,0,0,0,1235,1236,1,0,0,0,1236,1241,
	1,0,0,0,1237,1235,1,0,0,0,1238,1239,3,234,117,0,1239,1240,5,71,0,0,1240,
	1242,1,0,0,0,1241,1238,1,0,0,0,1241,1242,1,0,0,0,1242,1243,1,0,0,0,1243,
	1244,5,114,0,0,1244,1245,5,110,0,0,1245,1292,5,115,0,0,1246,1250,5,47,0,
	0,1247,1249,3,236,118,0,1248,1247,1,0,0,0,1249,1252,1,0,0,0,1250,1248,1,
	0,0,0,1250,1251,1,0,0,0,1251,1256,1,0,0,0,1252,1250,1,0,0,0,1253,1254,3,
	234,117,0,1254,1255,5,71,0,0,1255,1257,1,0,0,0,1256,1253,1,0,0,0,1256,1257,
	1,0,0,0,1257,1258,1,0,0,0,1258,1292,5,110,0,0,1259,1263,5,47,0,0,1260,1262,
	3,236,118,0,1261,1260,1,0,0,0,1262,1265,1,0,0,0,1263,1261,1,0,0,0,1263,
	1264,1,0,0,0,1264,1269,1,0,0,0,1265,1263,1,0,0,0,1266,1267,3,234,117,0,
	1267,1268,5,71,0,0,1268,1270,1,0,0,0,1269,1266,1,0,0,0,1269,1270,1,0,0,
	0,1270,1271,1,0,0,0,1271,1273,5,114,0,0,1272,1274,3,244,122,0,1273,1272,
	1,0,0,0,1274,1275,1,0,0,0,1275,1273,1,0,0,0,1275,1276,1,0,0,0,1276,1277,
	1,0,0,0,1277,1278,5,115,0,0,1278,1292,1,0,0,0,1279,1283,5,47,0,0,1280,1282,
	3,236,118,0,1281,1280,1,0,0,0,1282,1285,1,0,0,0,1283,1281,1,0,0,0,1283,
	1284,1,0,0,0,1284,1287,1,0,0,0,1285,1283,1,0,0,0,1286,1288,3,244,122,0,
	1287,1286,1,0,0,0,1288,1289,1,0,0,0,1289,1287,1,0,0,0,1289,1290,1,0,0,0,
	1290,1292,1,0,0,0,1291,1231,1,0,0,0,1291,1246,1,0,0,0,1291,1259,1,0,0,0,
	1291,1279,1,0,0,0,1292,233,1,0,0,0,1293,1294,7,1,0,0,1294,235,1,0,0,0,1295,
	1296,3,238,119,0,1296,1297,5,71,0,0,1297,1298,3,240,120,0,1298,237,1,0,
	0,0,1299,1300,7,10,0,0,1300,239,1,0,0,0,1301,1306,3,246,123,0,1302,1303,
	5,76,0,0,1303,1305,3,246,123,0,1304,1302,1,0,0,0,1305,1308,1,0,0,0,1306,
	1304,1,0,0,0,1306,1307,1,0,0,0,1307,1312,1,0,0,0,1308,1306,1,0,0,0,1309,
	1312,5,117,0,0,1310,1312,5,110,0,0,1311,1301,1,0,0,0,1311,1309,1,0,0,0,
	1311,1310,1,0,0,0,1312,241,1,0,0,0,1313,1314,7,11,0,0,1314,243,1,0,0,0,
	1315,1317,3,242,121,0,1316,1315,1,0,0,0,1317,1318,1,0,0,0,1318,1316,1,0,
	0,0,1318,1319,1,0,0,0,1319,1329,1,0,0,0,1320,1324,5,114,0,0,1321,1323,3,
	244,122,0,1322,1321,1,0,0,0,1323,1326,1,0,0,0,1324,1322,1,0,0,0,1324,1325,
	1,0,0,0,1325,1327,1,0,0,0,1326,1324,1,0,0,0,1327,1329,5,115,0,0,1328,1316,
	1,0,0,0,1328,1320,1,0,0,0,1329,245,1,0,0,0,1330,1331,3,248,124,0,1331,1332,
	5,74,0,0,1332,1333,3,252,126,0,1333,1340,1,0,0,0,1334,1335,3,252,126,0,
	1335,1336,5,73,0,0,1336,1337,3,250,125,0,1337,1340,1,0,0,0,1338,1340,3,
	254,127,0,1339,1330,1,0,0,0,1339,1334,1,0,0,0,1339,1338,1,0,0,0,1340,247,
	1,0,0,0,1341,1342,7,12,0,0,1342,249,1,0,0,0,1343,1344,7,12,0,0,1344,251,
	1,0,0,0,1345,1346,7,12,0,0,1346,253,1,0,0,0,1347,1348,7,13,0,0,1348,255,
	1,0,0,0,138,259,265,282,293,329,344,350,369,373,377,385,393,398,403,406,
	422,430,434,441,447,451,460,467,472,481,488,496,505,508,513,515,519,523,
	527,532,536,541,549,558,563,567,581,592,598,605,614,623,643,651,654,661,
	672,679,687,690,698,712,721,732,742,748,750,754,759,773,780,803,806,810,
	819,834,866,878,888,892,895,910,913,922,931,942,946,953,961,966,974,976,
	981,988,995,1004,1011,1020,1025,1036,1042,1050,1052,1063,1070,1078,1083,
	1087,1092,1094,1101,1109,1112,1121,1129,1132,1142,1159,1170,1181,1186,1192,
	1195,1200,1215,1220,1228,1235,1241,1250,1256,1263,1269,1275,1283,1289,1291,
	1306,1311,1318,1324,1328,1339];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!esql_parser.__ATN) {
			esql_parser.__ATN = new ATNDeserializer().deserialize(esql_parser._serializedATN);
		}

		return esql_parser.__ATN;
	}


	static DecisionsToDFA = esql_parser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class StatementsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public singleStatement(): SingleStatementContext {
		return this.getTypedRuleContext(SingleStatementContext, 0) as SingleStatementContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(esql_parser.EOF, 0);
	}
	public setCommand_list(): SetCommandContext[] {
		return this.getTypedRuleContexts(SetCommandContext) as SetCommandContext[];
	}
	public setCommand(i: number): SetCommandContext {
		return this.getTypedRuleContext(SetCommandContext, i) as SetCommandContext;
	}
	public letCommand_list(): LetCommandContext[] {
		return this.getTypedRuleContexts(LetCommandContext) as LetCommandContext[];
	}
	public letCommand(i: number): LetCommandContext {
		return this.getTypedRuleContext(LetCommandContext, i) as LetCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_statements;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterStatements) {
	 		listener.enterStatements(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitStatements) {
	 		listener.exitStatements(this);
		}
	}
}


export class SingleStatementContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public query(): QueryContext {
		return this.getTypedRuleContext(QueryContext, 0) as QueryContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(esql_parser.EOF, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_singleStatement;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSingleStatement) {
	 		listener.enterSingleStatement(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSingleStatement) {
	 		listener.exitSingleStatement(this);
		}
	}
}


export class QueryContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_query;
	}
	public override copyFrom(ctx: QueryContext): void {
		super.copyFrom(ctx);
	}
}
export class CompositeQueryContext extends QueryContext {
	constructor(parser: esql_parser, ctx: QueryContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public query(): QueryContext {
		return this.getTypedRuleContext(QueryContext, 0) as QueryContext;
	}
	public PIPE(): TerminalNode {
		return this.getToken(esql_parser.PIPE, 0);
	}
	public processingCommand(): ProcessingCommandContext {
		return this.getTypedRuleContext(ProcessingCommandContext, 0) as ProcessingCommandContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterCompositeQuery) {
	 		listener.enterCompositeQuery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitCompositeQuery) {
	 		listener.exitCompositeQuery(this);
		}
	}
}
export class SingleCommandQueryContext extends QueryContext {
	constructor(parser: esql_parser, ctx: QueryContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public sourceCommand(): SourceCommandContext {
		return this.getTypedRuleContext(SourceCommandContext, 0) as SourceCommandContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSingleCommandQuery) {
	 		listener.enterSingleCommandQuery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSingleCommandQuery) {
	 		listener.exitSingleCommandQuery(this);
		}
	}
}


export class SourceCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public fromCommand(): FromCommandContext {
		return this.getTypedRuleContext(FromCommandContext, 0) as FromCommandContext;
	}
	public rowCommand(): RowCommandContext {
		return this.getTypedRuleContext(RowCommandContext, 0) as RowCommandContext;
	}
	public showCommand(): ShowCommandContext {
		return this.getTypedRuleContext(ShowCommandContext, 0) as ShowCommandContext;
	}
	public timeSeriesCommand(): TimeSeriesCommandContext {
		return this.getTypedRuleContext(TimeSeriesCommandContext, 0) as TimeSeriesCommandContext;
	}
	public promqlCommand(): PromqlCommandContext {
		return this.getTypedRuleContext(PromqlCommandContext, 0) as PromqlCommandContext;
	}
	public explainCommand(): ExplainCommandContext {
		return this.getTypedRuleContext(ExplainCommandContext, 0) as ExplainCommandContext;
	}
	public externalCommand(): ExternalCommandContext {
		return this.getTypedRuleContext(ExternalCommandContext, 0) as ExternalCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_sourceCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSourceCommand) {
	 		listener.enterSourceCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSourceCommand) {
	 		listener.exitSourceCommand(this);
		}
	}
}


export class ProcessingCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public evalCommand(): EvalCommandContext {
		return this.getTypedRuleContext(EvalCommandContext, 0) as EvalCommandContext;
	}
	public whereCommand(): WhereCommandContext {
		return this.getTypedRuleContext(WhereCommandContext, 0) as WhereCommandContext;
	}
	public keepCommand(): KeepCommandContext {
		return this.getTypedRuleContext(KeepCommandContext, 0) as KeepCommandContext;
	}
	public limitCommand(): LimitCommandContext {
		return this.getTypedRuleContext(LimitCommandContext, 0) as LimitCommandContext;
	}
	public statsCommand(): StatsCommandContext {
		return this.getTypedRuleContext(StatsCommandContext, 0) as StatsCommandContext;
	}
	public sortCommand(): SortCommandContext {
		return this.getTypedRuleContext(SortCommandContext, 0) as SortCommandContext;
	}
	public dropCommand(): DropCommandContext {
		return this.getTypedRuleContext(DropCommandContext, 0) as DropCommandContext;
	}
	public renameCommand(): RenameCommandContext {
		return this.getTypedRuleContext(RenameCommandContext, 0) as RenameCommandContext;
	}
	public dissectCommand(): DissectCommandContext {
		return this.getTypedRuleContext(DissectCommandContext, 0) as DissectCommandContext;
	}
	public grokCommand(): GrokCommandContext {
		return this.getTypedRuleContext(GrokCommandContext, 0) as GrokCommandContext;
	}
	public enrichCommand(): EnrichCommandContext {
		return this.getTypedRuleContext(EnrichCommandContext, 0) as EnrichCommandContext;
	}
	public mvExpandCommand(): MvExpandCommandContext {
		return this.getTypedRuleContext(MvExpandCommandContext, 0) as MvExpandCommandContext;
	}
	public joinCommand(): JoinCommandContext {
		return this.getTypedRuleContext(JoinCommandContext, 0) as JoinCommandContext;
	}
	public changePointCommand(): ChangePointCommandContext {
		return this.getTypedRuleContext(ChangePointCommandContext, 0) as ChangePointCommandContext;
	}
	public completionCommand(): CompletionCommandContext {
		return this.getTypedRuleContext(CompletionCommandContext, 0) as CompletionCommandContext;
	}
	public sampleCommand(): SampleCommandContext {
		return this.getTypedRuleContext(SampleCommandContext, 0) as SampleCommandContext;
	}
	public forkCommand(): ForkCommandContext {
		return this.getTypedRuleContext(ForkCommandContext, 0) as ForkCommandContext;
	}
	public rerankCommand(): RerankCommandContext {
		return this.getTypedRuleContext(RerankCommandContext, 0) as RerankCommandContext;
	}
	public inlineStatsCommand(): InlineStatsCommandContext {
		return this.getTypedRuleContext(InlineStatsCommandContext, 0) as InlineStatsCommandContext;
	}
	public fuseCommand(): FuseCommandContext {
		return this.getTypedRuleContext(FuseCommandContext, 0) as FuseCommandContext;
	}
	public uriPartsCommand(): UriPartsCommandContext {
		return this.getTypedRuleContext(UriPartsCommandContext, 0) as UriPartsCommandContext;
	}
	public metricsInfoCommand(): MetricsInfoCommandContext {
		return this.getTypedRuleContext(MetricsInfoCommandContext, 0) as MetricsInfoCommandContext;
	}
	public registeredDomainCommand(): RegisteredDomainCommandContext {
		return this.getTypedRuleContext(RegisteredDomainCommandContext, 0) as RegisteredDomainCommandContext;
	}
	public tsInfoCommand(): TsInfoCommandContext {
		return this.getTypedRuleContext(TsInfoCommandContext, 0) as TsInfoCommandContext;
	}
	public userAgentCommand(): UserAgentCommandContext {
		return this.getTypedRuleContext(UserAgentCommandContext, 0) as UserAgentCommandContext;
	}
	public tsCollapseCommand(): TsCollapseCommandContext {
		return this.getTypedRuleContext(TsCollapseCommandContext, 0) as TsCollapseCommandContext;
	}
	public ipLocationCommand(): IpLocationCommandContext {
		return this.getTypedRuleContext(IpLocationCommandContext, 0) as IpLocationCommandContext;
	}
	public mmrCommand(): MmrCommandContext {
		return this.getTypedRuleContext(MmrCommandContext, 0) as MmrCommandContext;
	}
	public highlightCommand(): HighlightCommandContext {
		return this.getTypedRuleContext(HighlightCommandContext, 0) as HighlightCommandContext;
	}
	public denseVectorCommand(): DenseVectorCommandContext {
		return this.getTypedRuleContext(DenseVectorCommandContext, 0) as DenseVectorCommandContext;
	}
	public lookupCommand(): LookupCommandContext {
		return this.getTypedRuleContext(LookupCommandContext, 0) as LookupCommandContext;
	}
	public dedupCommand(): DedupCommandContext {
		return this.getTypedRuleContext(DedupCommandContext, 0) as DedupCommandContext;
	}
	public fillNullCommand(): FillNullCommandContext {
		return this.getTypedRuleContext(FillNullCommandContext, 0) as FillNullCommandContext;
	}
	public describeCommand(): DescribeCommandContext {
		return this.getTypedRuleContext(DescribeCommandContext, 0) as DescribeCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_processingCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterProcessingCommand) {
	 		listener.enterProcessingCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitProcessingCommand) {
	 		listener.exitProcessingCommand(this);
		}
	}
}


export class WhereCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHERE(): TerminalNode {
		return this.getToken(esql_parser.WHERE, 0);
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_whereCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterWhereCommand) {
	 		listener.enterWhereCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitWhereCommand) {
	 		listener.exitWhereCommand(this);
		}
	}
}


export class DataTypeContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dataType;
	}
	public override copyFrom(ctx: DataTypeContext): void {
		super.copyFrom(ctx);
	}
}
export class ToDataTypeContext extends DataTypeContext {
	constructor(parser: esql_parser, ctx: DataTypeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterToDataType) {
	 		listener.enterToDataType(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitToDataType) {
	 		listener.exitToDataType(this);
		}
	}
}


export class RowCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ROW(): TerminalNode {
		return this.getToken(esql_parser.ROW, 0);
	}
	public fields(): FieldsContext {
		return this.getTypedRuleContext(FieldsContext, 0) as FieldsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_rowCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRowCommand) {
	 		listener.enterRowCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRowCommand) {
	 		listener.exitRowCommand(this);
		}
	}
}


export class FieldsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public field_list(): FieldContext[] {
		return this.getTypedRuleContexts(FieldContext) as FieldContext[];
	}
	public field(i: number): FieldContext {
		return this.getTypedRuleContext(FieldContext, i) as FieldContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fields;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFields) {
	 		listener.enterFields(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFields) {
	 		listener.exitFields(this);
		}
	}
}


export class FieldContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_field;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterField) {
	 		listener.enterField(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitField) {
	 		listener.exitField(this);
		}
	}
}


export class FromCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FROM(): TerminalNode {
		return this.getToken(esql_parser.FROM, 0);
	}
	public indexPatternAndMetadataFields(): IndexPatternAndMetadataFieldsContext {
		return this.getTypedRuleContext(IndexPatternAndMetadataFieldsContext, 0) as IndexPatternAndMetadataFieldsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fromCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFromCommand) {
	 		listener.enterFromCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFromCommand) {
	 		listener.exitFromCommand(this);
		}
	}
}


export class TimeSeriesCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TS(): TerminalNode {
		return this.getToken(esql_parser.TS, 0);
	}
	public indexPatternAndMetadataFields(): IndexPatternAndMetadataFieldsContext {
		return this.getTypedRuleContext(IndexPatternAndMetadataFieldsContext, 0) as IndexPatternAndMetadataFieldsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_timeSeriesCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterTimeSeriesCommand) {
	 		listener.enterTimeSeriesCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitTimeSeriesCommand) {
	 		listener.exitTimeSeriesCommand(this);
		}
	}
}


export class ExternalCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_EXTERNAL(): TerminalNode {
		return this.getToken(esql_parser.DEV_EXTERNAL, 0);
	}
	public stringOrParameter(): StringOrParameterContext {
		return this.getTypedRuleContext(StringOrParameterContext, 0) as StringOrParameterContext;
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_externalCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterExternalCommand) {
	 		listener.enterExternalCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitExternalCommand) {
	 		listener.exitExternalCommand(this);
		}
	}
}


export class IndexPatternAndMetadataFieldsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public indexPatternOrSubquery_list(): IndexPatternOrSubqueryContext[] {
		return this.getTypedRuleContexts(IndexPatternOrSubqueryContext) as IndexPatternOrSubqueryContext[];
	}
	public indexPatternOrSubquery(i: number): IndexPatternOrSubqueryContext {
		return this.getTypedRuleContext(IndexPatternOrSubqueryContext, i) as IndexPatternOrSubqueryContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public metadata(): MetadataContext {
		return this.getTypedRuleContext(MetadataContext, 0) as MetadataContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_indexPatternAndMetadataFields;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIndexPatternAndMetadataFields) {
	 		listener.enterIndexPatternAndMetadataFields(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIndexPatternAndMetadataFields) {
	 		listener.exitIndexPatternAndMetadataFields(this);
		}
	}
}


export class IndexPatternOrSubqueryContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public indexPattern(): IndexPatternContext {
		return this.getTypedRuleContext(IndexPatternContext, 0) as IndexPatternContext;
	}
	public subquery(): SubqueryContext {
		return this.getTypedRuleContext(SubqueryContext, 0) as SubqueryContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_indexPatternOrSubquery;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIndexPatternOrSubquery) {
	 		listener.enterIndexPatternOrSubquery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIndexPatternOrSubquery) {
	 		listener.exitIndexPatternOrSubquery(this);
		}
	}
}


export class SubqueryContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public subquerySourceCommand(): SubquerySourceCommandContext {
		return this.getTypedRuleContext(SubquerySourceCommandContext, 0) as SubquerySourceCommandContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public PIPE_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.PIPE);
	}
	public PIPE(i: number): TerminalNode {
		return this.getToken(esql_parser.PIPE, i);
	}
	public processingCommand_list(): ProcessingCommandContext[] {
		return this.getTypedRuleContexts(ProcessingCommandContext) as ProcessingCommandContext[];
	}
	public processingCommand(i: number): ProcessingCommandContext {
		return this.getTypedRuleContext(ProcessingCommandContext, i) as ProcessingCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_subquery;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSubquery) {
	 		listener.enterSubquery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSubquery) {
	 		listener.exitSubquery(this);
		}
	}
}


export class SubquerySourceCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public fromCommand(): FromCommandContext {
		return this.getTypedRuleContext(FromCommandContext, 0) as FromCommandContext;
	}
	public rowCommand(): RowCommandContext {
		return this.getTypedRuleContext(RowCommandContext, 0) as RowCommandContext;
	}
	public timeSeriesCommand(): TimeSeriesCommandContext {
		return this.getTypedRuleContext(TimeSeriesCommandContext, 0) as TimeSeriesCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_subquerySourceCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSubquerySourceCommand) {
	 		listener.enterSubquerySourceCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSubquerySourceCommand) {
	 		listener.exitSubquerySourceCommand(this);
		}
	}
}


export class IndexPatternContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public unquotedIndexString(): UnquotedIndexStringContext {
		return this.getTypedRuleContext(UnquotedIndexStringContext, 0) as UnquotedIndexStringContext;
	}
	public clusterString(): ClusterStringContext {
		return this.getTypedRuleContext(ClusterStringContext, 0) as ClusterStringContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(esql_parser.COLON, 0);
	}
	public CAST_OP(): TerminalNode {
		return this.getToken(esql_parser.CAST_OP, 0);
	}
	public selectorString(): SelectorStringContext {
		return this.getTypedRuleContext(SelectorStringContext, 0) as SelectorStringContext;
	}
	public indexString(): IndexStringContext {
		return this.getTypedRuleContext(IndexStringContext, 0) as IndexStringContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_indexPattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIndexPattern) {
	 		listener.enterIndexPattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIndexPattern) {
	 		listener.exitIndexPattern(this);
		}
	}
}


export class ClusterStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_clusterString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterClusterString) {
	 		listener.enterClusterString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitClusterString) {
	 		listener.exitClusterString(this);
		}
	}
}


export class SelectorStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_selectorString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSelectorString) {
	 		listener.enterSelectorString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSelectorString) {
	 		listener.exitSelectorString(this);
		}
	}
}


export class UnquotedIndexStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_unquotedIndexString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterUnquotedIndexString) {
	 		listener.enterUnquotedIndexString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitUnquotedIndexString) {
	 		listener.exitUnquotedIndexString(this);
		}
	}
}


export class IndexStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_indexString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIndexString) {
	 		listener.enterIndexString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIndexString) {
	 		listener.exitIndexString(this);
		}
	}
}


export class MetadataContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public METADATA(): TerminalNode {
		return this.getToken(esql_parser.METADATA, 0);
	}
	public UNQUOTED_SOURCE_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.UNQUOTED_SOURCE);
	}
	public UNQUOTED_SOURCE(i: number): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_metadata;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMetadata) {
	 		listener.enterMetadata(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMetadata) {
	 		listener.exitMetadata(this);
		}
	}
}


export class EvalCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EVAL(): TerminalNode {
		return this.getToken(esql_parser.EVAL, 0);
	}
	public fields(): FieldsContext {
		return this.getTypedRuleContext(FieldsContext, 0) as FieldsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_evalCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterEvalCommand) {
	 		listener.enterEvalCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitEvalCommand) {
	 		listener.exitEvalCommand(this);
		}
	}
}


export class StatsCommandContext extends ParserRuleContext {
	public _stats!: AggFieldsContext;
	public _grouping!: FieldsContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STATS(): TerminalNode {
		return this.getToken(esql_parser.STATS, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(esql_parser.BY, 0);
	}
	public aggFields(): AggFieldsContext {
		return this.getTypedRuleContext(AggFieldsContext, 0) as AggFieldsContext;
	}
	public fields(): FieldsContext {
		return this.getTypedRuleContext(FieldsContext, 0) as FieldsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_statsCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterStatsCommand) {
	 		listener.enterStatsCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitStatsCommand) {
	 		listener.exitStatsCommand(this);
		}
	}
}


export class AggFieldsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public aggField_list(): AggFieldContext[] {
		return this.getTypedRuleContexts(AggFieldContext) as AggFieldContext[];
	}
	public aggField(i: number): AggFieldContext {
		return this.getTypedRuleContext(AggFieldContext, i) as AggFieldContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_aggFields;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterAggFields) {
	 		listener.enterAggFields(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitAggFields) {
	 		listener.exitAggFields(this);
		}
	}
}


export class AggFieldContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public field(): FieldContext {
		return this.getTypedRuleContext(FieldContext, 0) as FieldContext;
	}
	public WHERE(): TerminalNode {
		return this.getToken(esql_parser.WHERE, 0);
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_aggField;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterAggField) {
	 		listener.enterAggField(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitAggField) {
	 		listener.exitAggField(this);
		}
	}
}


export class QualifiedNameContext extends ParserRuleContext {
	public _qualifier!: Token;
	public _name!: FieldNameContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPENING_BRACKET_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.OPENING_BRACKET);
	}
	public OPENING_BRACKET(i: number): TerminalNode {
		return this.getToken(esql_parser.OPENING_BRACKET, i);
	}
	public CLOSING_BRACKET_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.CLOSING_BRACKET);
	}
	public CLOSING_BRACKET(i: number): TerminalNode {
		return this.getToken(esql_parser.CLOSING_BRACKET, i);
	}
	public DOT(): TerminalNode {
		return this.getToken(esql_parser.DOT, 0);
	}
	public fieldName(): FieldNameContext {
		return this.getTypedRuleContext(FieldNameContext, 0) as FieldNameContext;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_qualifiedName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterQualifiedName) {
	 		listener.enterQualifiedName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitQualifiedName) {
	 		listener.exitQualifiedName(this);
		}
	}
}


export class FieldNameContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrParameter_list(): IdentifierOrParameterContext[] {
		return this.getTypedRuleContexts(IdentifierOrParameterContext) as IdentifierOrParameterContext[];
	}
	public identifierOrParameter(i: number): IdentifierOrParameterContext {
		return this.getTypedRuleContext(IdentifierOrParameterContext, i) as IdentifierOrParameterContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(esql_parser.DOT, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fieldName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFieldName) {
	 		listener.enterFieldName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFieldName) {
	 		listener.exitFieldName(this);
		}
	}
}


export class QualifiedNamePatternContext extends ParserRuleContext {
	public _qualifier!: Token;
	public _name!: FieldNamePatternContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPENING_BRACKET_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.OPENING_BRACKET);
	}
	public OPENING_BRACKET(i: number): TerminalNode {
		return this.getToken(esql_parser.OPENING_BRACKET, i);
	}
	public CLOSING_BRACKET_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.CLOSING_BRACKET);
	}
	public CLOSING_BRACKET(i: number): TerminalNode {
		return this.getToken(esql_parser.CLOSING_BRACKET, i);
	}
	public DOT(): TerminalNode {
		return this.getToken(esql_parser.DOT, 0);
	}
	public fieldNamePattern(): FieldNamePatternContext {
		return this.getTypedRuleContext(FieldNamePatternContext, 0) as FieldNamePatternContext;
	}
	public ID_PATTERN(): TerminalNode {
		return this.getToken(esql_parser.ID_PATTERN, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_qualifiedNamePattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterQualifiedNamePattern) {
	 		listener.enterQualifiedNamePattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitQualifiedNamePattern) {
	 		listener.exitQualifiedNamePattern(this);
		}
	}
}


export class FieldNamePatternContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierPattern_list(): IdentifierPatternContext[] {
		return this.getTypedRuleContexts(IdentifierPatternContext) as IdentifierPatternContext[];
	}
	public identifierPattern(i: number): IdentifierPatternContext {
		return this.getTypedRuleContext(IdentifierPatternContext, i) as IdentifierPatternContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(esql_parser.DOT, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fieldNamePattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFieldNamePattern) {
	 		listener.enterFieldNamePattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFieldNamePattern) {
	 		listener.exitFieldNamePattern(this);
		}
	}
}


export class QualifiedNamePatternsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedNamePattern_list(): QualifiedNamePatternContext[] {
		return this.getTypedRuleContexts(QualifiedNamePatternContext) as QualifiedNamePatternContext[];
	}
	public qualifiedNamePattern(i: number): QualifiedNamePatternContext {
		return this.getTypedRuleContext(QualifiedNamePatternContext, i) as QualifiedNamePatternContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_qualifiedNamePatterns;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterQualifiedNamePatterns) {
	 		listener.enterQualifiedNamePatterns(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitQualifiedNamePatterns) {
	 		listener.exitQualifiedNamePatterns(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public QUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_identifier;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIdentifier) {
	 		listener.enterIdentifier(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIdentifier) {
	 		listener.exitIdentifier(this);
		}
	}
}


export class IdentifierPatternContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_PATTERN(): TerminalNode {
		return this.getToken(esql_parser.ID_PATTERN, 0);
	}
	public expressionModeIdentifierPattern(): ExpressionModeIdentifierPatternContext {
		return this.getTypedRuleContext(ExpressionModeIdentifierPatternContext, 0) as ExpressionModeIdentifierPatternContext;
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
	public doubleParameter(): DoubleParameterContext {
		return this.getTypedRuleContext(DoubleParameterContext, 0) as DoubleParameterContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_identifierPattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIdentifierPattern) {
	 		listener.enterIdentifierPattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIdentifierPattern) {
	 		listener.exitIdentifierPattern(this);
		}
	}
}


export class ExpressionModeIdentifierPatternContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASTERISK_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.ASTERISK);
	}
	public ASTERISK(i: number): TerminalNode {
		return this.getToken(esql_parser.ASTERISK, i);
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_expressionModeIdentifierPattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterExpressionModeIdentifierPattern) {
	 		listener.enterExpressionModeIdentifierPattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitExpressionModeIdentifierPattern) {
	 		listener.exitExpressionModeIdentifierPattern(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_parameter;
	}
	public override copyFrom(ctx: ParameterContext): void {
		super.copyFrom(ctx);
	}
}
export class InputNamedOrPositionalParamContext extends ParameterContext {
	constructor(parser: esql_parser, ctx: ParameterContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInputNamedOrPositionalParam) {
	 		listener.enterInputNamedOrPositionalParam(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInputNamedOrPositionalParam) {
	 		listener.exitInputNamedOrPositionalParam(this);
		}
	}
}
export class InputParamContext extends ParameterContext {
	constructor(parser: esql_parser, ctx: ParameterContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public PARAM(): TerminalNode {
		return this.getToken(esql_parser.PARAM, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInputParam) {
	 		listener.enterInputParam(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInputParam) {
	 		listener.exitInputParam(this);
		}
	}
}


export class DoubleParameterContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_doubleParameter;
	}
	public override copyFrom(ctx: DoubleParameterContext): void {
		super.copyFrom(ctx);
	}
}
export class InputDoubleParamsContext extends DoubleParameterContext {
	constructor(parser: esql_parser, ctx: DoubleParameterContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DOUBLE_PARAMS(): TerminalNode {
		return this.getToken(esql_parser.DOUBLE_PARAMS, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInputDoubleParams) {
	 		listener.enterInputDoubleParams(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInputDoubleParams) {
	 		listener.exitInputDoubleParams(this);
		}
	}
}
export class InputNamedOrPositionalDoubleParamsContext extends DoubleParameterContext {
	constructor(parser: esql_parser, ctx: DoubleParameterContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NAMED_OR_POSITIONAL_DOUBLE_PARAMS(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_DOUBLE_PARAMS, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInputNamedOrPositionalDoubleParams) {
	 		listener.enterInputNamedOrPositionalDoubleParams(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInputNamedOrPositionalDoubleParams) {
	 		listener.exitInputNamedOrPositionalDoubleParams(this);
		}
	}
}


export class IdentifierOrParameterContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
	public doubleParameter(): DoubleParameterContext {
		return this.getTypedRuleContext(DoubleParameterContext, 0) as DoubleParameterContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_identifierOrParameter;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIdentifierOrParameter) {
	 		listener.enterIdentifierOrParameter(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIdentifierOrParameter) {
	 		listener.exitIdentifierOrParameter(this);
		}
	}
}


export class StringOrParameterContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_stringOrParameter;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterStringOrParameter) {
	 		listener.enterStringOrParameter(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitStringOrParameter) {
	 		listener.exitStringOrParameter(this);
		}
	}
}


export class LimitCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LIMIT(): TerminalNode {
		return this.getToken(esql_parser.LIMIT, 0);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public limitByGroupKey(): LimitByGroupKeyContext {
		return this.getTypedRuleContext(LimitByGroupKeyContext, 0) as LimitByGroupKeyContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_limitCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLimitCommand) {
	 		listener.enterLimitCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLimitCommand) {
	 		listener.exitLimitCommand(this);
		}
	}
}


export class LimitByGroupKeyContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BY(): TerminalNode {
		return this.getToken(esql_parser.BY, 0);
	}
	public booleanExpression_list(): BooleanExpressionContext[] {
		return this.getTypedRuleContexts(BooleanExpressionContext) as BooleanExpressionContext[];
	}
	public booleanExpression(i: number): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, i) as BooleanExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_limitByGroupKey;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLimitByGroupKey) {
	 		listener.enterLimitByGroupKey(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLimitByGroupKey) {
	 		listener.exitLimitByGroupKey(this);
		}
	}
}


export class SortCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SORT(): TerminalNode {
		return this.getToken(esql_parser.SORT, 0);
	}
	public orderExpression_list(): OrderExpressionContext[] {
		return this.getTypedRuleContexts(OrderExpressionContext) as OrderExpressionContext[];
	}
	public orderExpression(i: number): OrderExpressionContext {
		return this.getTypedRuleContext(OrderExpressionContext, i) as OrderExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_sortCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSortCommand) {
	 		listener.enterSortCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSortCommand) {
	 		listener.exitSortCommand(this);
		}
	}
}


export class OrderExpressionContext extends ParserRuleContext {
	public _ordering!: Token;
	public _nullOrdering!: Token;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public NULLS(): TerminalNode {
		return this.getToken(esql_parser.NULLS, 0);
	}
	public ASC(): TerminalNode {
		return this.getToken(esql_parser.ASC, 0);
	}
	public DESC(): TerminalNode {
		return this.getToken(esql_parser.DESC, 0);
	}
	public FIRST(): TerminalNode {
		return this.getToken(esql_parser.FIRST, 0);
	}
	public LAST(): TerminalNode {
		return this.getToken(esql_parser.LAST, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_orderExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterOrderExpression) {
	 		listener.enterOrderExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitOrderExpression) {
	 		listener.exitOrderExpression(this);
		}
	}
}


export class KeepCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public KEEP(): TerminalNode {
		return this.getToken(esql_parser.KEEP, 0);
	}
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		return this.getTypedRuleContext(QualifiedNamePatternsContext, 0) as QualifiedNamePatternsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_keepCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterKeepCommand) {
	 		listener.enterKeepCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitKeepCommand) {
	 		listener.exitKeepCommand(this);
		}
	}
}


export class DropCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(esql_parser.DROP, 0);
	}
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		return this.getTypedRuleContext(QualifiedNamePatternsContext, 0) as QualifiedNamePatternsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dropCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDropCommand) {
	 		listener.enterDropCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDropCommand) {
	 		listener.exitDropCommand(this);
		}
	}
}


export class RenameCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RENAME(): TerminalNode {
		return this.getToken(esql_parser.RENAME, 0);
	}
	public renameClause_list(): RenameClauseContext[] {
		return this.getTypedRuleContexts(RenameClauseContext) as RenameClauseContext[];
	}
	public renameClause(i: number): RenameClauseContext {
		return this.getTypedRuleContext(RenameClauseContext, i) as RenameClauseContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_renameCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRenameCommand) {
	 		listener.enterRenameCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRenameCommand) {
	 		listener.exitRenameCommand(this);
		}
	}
}


export class RenameClauseContext extends ParserRuleContext {
	public _oldName!: QualifiedNamePatternContext;
	public _newName!: QualifiedNamePatternContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AS(): TerminalNode {
		return this.getToken(esql_parser.AS, 0);
	}
	public qualifiedNamePattern_list(): QualifiedNamePatternContext[] {
		return this.getTypedRuleContexts(QualifiedNamePatternContext) as QualifiedNamePatternContext[];
	}
	public qualifiedNamePattern(i: number): QualifiedNamePatternContext {
		return this.getTypedRuleContext(QualifiedNamePatternContext, i) as QualifiedNamePatternContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_renameClause;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRenameClause) {
	 		listener.enterRenameClause(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRenameClause) {
	 		listener.exitRenameClause(this);
		}
	}
}


export class DissectCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DISSECT(): TerminalNode {
		return this.getToken(esql_parser.DISSECT, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public dissectCommandOptions(): DissectCommandOptionsContext {
		return this.getTypedRuleContext(DissectCommandOptionsContext, 0) as DissectCommandOptionsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dissectCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDissectCommand) {
	 		listener.enterDissectCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDissectCommand) {
	 		listener.exitDissectCommand(this);
		}
	}
}


export class DissectCommandOptionsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public dissectCommandOption_list(): DissectCommandOptionContext[] {
		return this.getTypedRuleContexts(DissectCommandOptionContext) as DissectCommandOptionContext[];
	}
	public dissectCommandOption(i: number): DissectCommandOptionContext {
		return this.getTypedRuleContext(DissectCommandOptionContext, i) as DissectCommandOptionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dissectCommandOptions;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDissectCommandOptions) {
	 		listener.enterDissectCommandOptions(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDissectCommandOptions) {
	 		listener.exitDissectCommandOptions(this);
		}
	}
}


export class DissectCommandOptionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dissectCommandOption;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDissectCommandOption) {
	 		listener.enterDissectCommandOption(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDissectCommandOption) {
	 		listener.exitDissectCommandOption(this);
		}
	}
}


export class CommandNamedParametersContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH(): TerminalNode {
		return this.getToken(esql_parser.WITH, 0);
	}
	public mapExpression(): MapExpressionContext {
		return this.getTypedRuleContext(MapExpressionContext, 0) as MapExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_commandNamedParameters;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterCommandNamedParameters) {
	 		listener.enterCommandNamedParameters(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitCommandNamedParameters) {
	 		listener.exitCommandNamedParameters(this);
		}
	}
}


export class GrokCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GROK(): TerminalNode {
		return this.getToken(esql_parser.GROK, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public string__list(): StringContext[] {
		return this.getTypedRuleContexts(StringContext) as StringContext[];
	}
	public string_(i: number): StringContext {
		return this.getTypedRuleContext(StringContext, i) as StringContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_grokCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterGrokCommand) {
	 		listener.enterGrokCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitGrokCommand) {
	 		listener.exitGrokCommand(this);
		}
	}
}


export class MvExpandCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MV_EXPAND(): TerminalNode {
		return this.getToken(esql_parser.MV_EXPAND, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_mvExpandCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMvExpandCommand) {
	 		listener.enterMvExpandCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMvExpandCommand) {
	 		listener.exitMvExpandCommand(this);
		}
	}
}


export class ExplainCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_EXPLAIN(): TerminalNode {
		return this.getToken(esql_parser.DEV_EXPLAIN, 0);
	}
	public subqueryExpression(): SubqueryExpressionContext {
		return this.getTypedRuleContext(SubqueryExpressionContext, 0) as SubqueryExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_explainCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterExplainCommand) {
	 		listener.enterExplainCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitExplainCommand) {
	 		listener.exitExplainCommand(this);
		}
	}
}


export class SubqueryExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public query(): QueryContext {
		return this.getTypedRuleContext(QueryContext, 0) as QueryContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_subqueryExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSubqueryExpression) {
	 		listener.enterSubqueryExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSubqueryExpression) {
	 		listener.exitSubqueryExpression(this);
		}
	}
}


export class ShowCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_showCommand;
	}
	public override copyFrom(ctx: ShowCommandContext): void {
		super.copyFrom(ctx);
	}
}
export class ShowInfoContext extends ShowCommandContext {
	constructor(parser: esql_parser, ctx: ShowCommandContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SHOW(): TerminalNode {
		return this.getToken(esql_parser.SHOW, 0);
	}
	public INFO(): TerminalNode {
		return this.getToken(esql_parser.INFO, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterShowInfo) {
	 		listener.enterShowInfo(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitShowInfo) {
	 		listener.exitShowInfo(this);
		}
	}
}


export class EnrichCommandContext extends ParserRuleContext {
	public _policyName!: EnrichPolicyNameContext;
	public _matchField!: QualifiedNamePatternContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENRICH(): TerminalNode {
		return this.getToken(esql_parser.ENRICH, 0);
	}
	public enrichPolicyName(): EnrichPolicyNameContext {
		return this.getTypedRuleContext(EnrichPolicyNameContext, 0) as EnrichPolicyNameContext;
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public WITH(): TerminalNode {
		return this.getToken(esql_parser.WITH, 0);
	}
	public enrichWithClause_list(): EnrichWithClauseContext[] {
		return this.getTypedRuleContexts(EnrichWithClauseContext) as EnrichWithClauseContext[];
	}
	public enrichWithClause(i: number): EnrichWithClauseContext {
		return this.getTypedRuleContext(EnrichWithClauseContext, i) as EnrichWithClauseContext;
	}
	public qualifiedNamePattern(): QualifiedNamePatternContext {
		return this.getTypedRuleContext(QualifiedNamePatternContext, 0) as QualifiedNamePatternContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_enrichCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterEnrichCommand) {
	 		listener.enterEnrichCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitEnrichCommand) {
	 		listener.exitEnrichCommand(this);
		}
	}
}


export class EnrichPolicyNameContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENRICH_POLICY_NAME(): TerminalNode {
		return this.getToken(esql_parser.ENRICH_POLICY_NAME, 0);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_enrichPolicyName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterEnrichPolicyName) {
	 		listener.enterEnrichPolicyName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitEnrichPolicyName) {
	 		listener.exitEnrichPolicyName(this);
		}
	}
}


export class EnrichWithClauseContext extends ParserRuleContext {
	public _newName!: QualifiedNamePatternContext;
	public _enrichField!: QualifiedNamePatternContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedNamePattern_list(): QualifiedNamePatternContext[] {
		return this.getTypedRuleContexts(QualifiedNamePatternContext) as QualifiedNamePatternContext[];
	}
	public qualifiedNamePattern(i: number): QualifiedNamePatternContext {
		return this.getTypedRuleContext(QualifiedNamePatternContext, i) as QualifiedNamePatternContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_enrichWithClause;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterEnrichWithClause) {
	 		listener.enterEnrichWithClause(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitEnrichWithClause) {
	 		listener.exitEnrichWithClause(this);
		}
	}
}


export class SampleCommandContext extends ParserRuleContext {
	public _probability!: ConstantContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SAMPLE(): TerminalNode {
		return this.getToken(esql_parser.SAMPLE, 0);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_sampleCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSampleCommand) {
	 		listener.enterSampleCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSampleCommand) {
	 		listener.exitSampleCommand(this);
		}
	}
}


export class ChangePointCommandContext extends ParserRuleContext {
	public _value!: QualifiedNameContext;
	public _key!: QualifiedNameContext;
	public _targetType!: QualifiedNameContext;
	public _targetPvalue!: QualifiedNameContext;
	public _booleanExpression!: BooleanExpressionContext;
	public _groupings: BooleanExpressionContext[] = [];
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CHANGE_POINT(): TerminalNode {
		return this.getToken(esql_parser.CHANGE_POINT, 0);
	}
	public qualifiedName_list(): QualifiedNameContext[] {
		return this.getTypedRuleContexts(QualifiedNameContext) as QualifiedNameContext[];
	}
	public qualifiedName(i: number): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, i) as QualifiedNameContext;
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public AS(): TerminalNode {
		return this.getToken(esql_parser.AS, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public BY(): TerminalNode {
		return this.getToken(esql_parser.BY, 0);
	}
	public booleanExpression_list(): BooleanExpressionContext[] {
		return this.getTypedRuleContexts(BooleanExpressionContext) as BooleanExpressionContext[];
	}
	public booleanExpression(i: number): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, i) as BooleanExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_changePointCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterChangePointCommand) {
	 		listener.enterChangePointCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitChangePointCommand) {
	 		listener.exitChangePointCommand(this);
		}
	}
}


export class ForkCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FORK(): TerminalNode {
		return this.getToken(esql_parser.FORK, 0);
	}
	public forkSubQueries(): ForkSubQueriesContext {
		return this.getTypedRuleContext(ForkSubQueriesContext, 0) as ForkSubQueriesContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_forkCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterForkCommand) {
	 		listener.enterForkCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitForkCommand) {
	 		listener.exitForkCommand(this);
		}
	}
}


export class ForkSubQueriesContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public forkSubQuery_list(): ForkSubQueryContext[] {
		return this.getTypedRuleContexts(ForkSubQueryContext) as ForkSubQueryContext[];
	}
	public forkSubQuery(i: number): ForkSubQueryContext {
		return this.getTypedRuleContext(ForkSubQueryContext, i) as ForkSubQueryContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_forkSubQueries;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterForkSubQueries) {
	 		listener.enterForkSubQueries(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitForkSubQueries) {
	 		listener.exitForkSubQueries(this);
		}
	}
}


export class ForkSubQueryContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public forkSubQueryCommand(): ForkSubQueryCommandContext {
		return this.getTypedRuleContext(ForkSubQueryCommandContext, 0) as ForkSubQueryCommandContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_forkSubQuery;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterForkSubQuery) {
	 		listener.enterForkSubQuery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitForkSubQuery) {
	 		listener.exitForkSubQuery(this);
		}
	}
}


export class ForkSubQueryCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_forkSubQueryCommand;
	}
	public override copyFrom(ctx: ForkSubQueryCommandContext): void {
		super.copyFrom(ctx);
	}
}
export class SingleForkSubQueryCommandContext extends ForkSubQueryCommandContext {
	constructor(parser: esql_parser, ctx: ForkSubQueryCommandContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public forkSubQueryProcessingCommand(): ForkSubQueryProcessingCommandContext {
		return this.getTypedRuleContext(ForkSubQueryProcessingCommandContext, 0) as ForkSubQueryProcessingCommandContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSingleForkSubQueryCommand) {
	 		listener.enterSingleForkSubQueryCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSingleForkSubQueryCommand) {
	 		listener.exitSingleForkSubQueryCommand(this);
		}
	}
}
export class CompositeForkSubQueryContext extends ForkSubQueryCommandContext {
	constructor(parser: esql_parser, ctx: ForkSubQueryCommandContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public forkSubQueryCommand(): ForkSubQueryCommandContext {
		return this.getTypedRuleContext(ForkSubQueryCommandContext, 0) as ForkSubQueryCommandContext;
	}
	public PIPE(): TerminalNode {
		return this.getToken(esql_parser.PIPE, 0);
	}
	public forkSubQueryProcessingCommand(): ForkSubQueryProcessingCommandContext {
		return this.getTypedRuleContext(ForkSubQueryProcessingCommandContext, 0) as ForkSubQueryProcessingCommandContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterCompositeForkSubQuery) {
	 		listener.enterCompositeForkSubQuery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitCompositeForkSubQuery) {
	 		listener.exitCompositeForkSubQuery(this);
		}
	}
}


export class ForkSubQueryProcessingCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public processingCommand(): ProcessingCommandContext {
		return this.getTypedRuleContext(ProcessingCommandContext, 0) as ProcessingCommandContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_forkSubQueryProcessingCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterForkSubQueryProcessingCommand) {
	 		listener.enterForkSubQueryProcessingCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitForkSubQueryProcessingCommand) {
	 		listener.exitForkSubQueryProcessingCommand(this);
		}
	}
}


export class RerankCommandContext extends ParserRuleContext {
	public _targetField!: QualifiedNameContext;
	public _queryText!: ConstantContext;
	public _rerankFields!: FieldsContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RERANK(): TerminalNode {
		return this.getToken(esql_parser.RERANK, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public fields(): FieldsContext {
		return this.getTypedRuleContext(FieldsContext, 0) as FieldsContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_rerankCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRerankCommand) {
	 		listener.enterRerankCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRerankCommand) {
	 		listener.exitRerankCommand(this);
		}
	}
}


export class CompletionCommandContext extends ParserRuleContext {
	public _targetField!: QualifiedNameContext;
	public _prompt!: PrimaryExpressionContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMPLETION(): TerminalNode {
		return this.getToken(esql_parser.COMPLETION, 0);
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_completionCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterCompletionCommand) {
	 		listener.enterCompletionCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitCompletionCommand) {
	 		listener.exitCompletionCommand(this);
		}
	}
}


export class InlineStatsCommandContext extends ParserRuleContext {
	public _stats!: AggFieldsContext;
	public _grouping!: FieldsContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INLINE(): TerminalNode {
		return this.getToken(esql_parser.INLINE, 0);
	}
	public INLINE_STATS(): TerminalNode {
		return this.getToken(esql_parser.INLINE_STATS, 0);
	}
	public aggFields(): AggFieldsContext {
		return this.getTypedRuleContext(AggFieldsContext, 0) as AggFieldsContext;
	}
	public BY(): TerminalNode {
		return this.getToken(esql_parser.BY, 0);
	}
	public fields(): FieldsContext {
		return this.getTypedRuleContext(FieldsContext, 0) as FieldsContext;
	}
	public INLINESTATS(): TerminalNode {
		return this.getToken(esql_parser.INLINESTATS, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_inlineStatsCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInlineStatsCommand) {
	 		listener.enterInlineStatsCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInlineStatsCommand) {
	 		listener.exitInlineStatsCommand(this);
		}
	}
}


export class FuseCommandContext extends ParserRuleContext {
	public _fuseType!: IdentifierContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FUSE(): TerminalNode {
		return this.getToken(esql_parser.FUSE, 0);
	}
	public fuseConfiguration_list(): FuseConfigurationContext[] {
		return this.getTypedRuleContexts(FuseConfigurationContext) as FuseConfigurationContext[];
	}
	public fuseConfiguration(i: number): FuseConfigurationContext {
		return this.getTypedRuleContext(FuseConfigurationContext, i) as FuseConfigurationContext;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fuseCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFuseCommand) {
	 		listener.enterFuseCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFuseCommand) {
	 		listener.exitFuseCommand(this);
		}
	}
}


export class FuseConfigurationContext extends ParserRuleContext {
	public _score!: QualifiedNameContext;
	public _key!: FuseKeyByFieldsContext;
	public _group!: QualifiedNameContext;
	public _options!: MapExpressionContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SCORE(): TerminalNode {
		return this.getToken(esql_parser.SCORE, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(esql_parser.BY, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public KEY(): TerminalNode {
		return this.getToken(esql_parser.KEY, 0);
	}
	public fuseKeyByFields(): FuseKeyByFieldsContext {
		return this.getTypedRuleContext(FuseKeyByFieldsContext, 0) as FuseKeyByFieldsContext;
	}
	public GROUP(): TerminalNode {
		return this.getToken(esql_parser.GROUP, 0);
	}
	public WITH(): TerminalNode {
		return this.getToken(esql_parser.WITH, 0);
	}
	public mapExpression(): MapExpressionContext {
		return this.getTypedRuleContext(MapExpressionContext, 0) as MapExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fuseConfiguration;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFuseConfiguration) {
	 		listener.enterFuseConfiguration(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFuseConfiguration) {
	 		listener.exitFuseConfiguration(this);
		}
	}
}


export class FuseKeyByFieldsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedName_list(): QualifiedNameContext[] {
		return this.getTypedRuleContexts(QualifiedNameContext) as QualifiedNameContext[];
	}
	public qualifiedName(i: number): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, i) as QualifiedNameContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fuseKeyByFields;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFuseKeyByFields) {
	 		listener.enterFuseKeyByFields(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFuseKeyByFields) {
	 		listener.exitFuseKeyByFields(this);
		}
	}
}


export class MetricsInfoCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public METRICS_INFO(): TerminalNode {
		return this.getToken(esql_parser.METRICS_INFO, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_metricsInfoCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMetricsInfoCommand) {
	 		listener.enterMetricsInfoCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMetricsInfoCommand) {
	 		listener.exitMetricsInfoCommand(this);
		}
	}
}


export class TsInfoCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TS_INFO(): TerminalNode {
		return this.getToken(esql_parser.TS_INFO, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_tsInfoCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterTsInfoCommand) {
	 		listener.enterTsInfoCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitTsInfoCommand) {
	 		listener.exitTsInfoCommand(this);
		}
	}
}


export class TsCollapseCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TS_COLLAPSE(): TerminalNode {
		return this.getToken(esql_parser.TS_COLLAPSE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_tsCollapseCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterTsCollapseCommand) {
	 		listener.enterTsCollapseCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitTsCollapseCommand) {
	 		listener.exitTsCollapseCommand(this);
		}
	}
}


export class DescribeCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_DESCRIBE(): TerminalNode {
		return this.getToken(esql_parser.DEV_DESCRIBE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_describeCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDescribeCommand) {
	 		listener.enterDescribeCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDescribeCommand) {
	 		listener.exitDescribeCommand(this);
		}
	}
}


export class LookupCommandContext extends ParserRuleContext {
	public _tableName!: IndexPatternContext;
	public _matchFields!: QualifiedNamePatternsContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_LOOKUP(): TerminalNode {
		return this.getToken(esql_parser.DEV_LOOKUP, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public indexPattern(): IndexPatternContext {
		return this.getTypedRuleContext(IndexPatternContext, 0) as IndexPatternContext;
	}
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		return this.getTypedRuleContext(QualifiedNamePatternsContext, 0) as QualifiedNamePatternsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_lookupCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLookupCommand) {
	 		listener.enterLookupCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLookupCommand) {
	 		listener.exitLookupCommand(this);
		}
	}
}


export class DedupCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEDUP(): TerminalNode {
		return this.getToken(esql_parser.DEDUP, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_dedupCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDedupCommand) {
	 		listener.enterDedupCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDedupCommand) {
	 		listener.exitDedupCommand(this);
		}
	}
}


export class HighlightCommandContext extends ParserRuleContext {
	public _prefixKeyword!: IdentifierContext;
	public _prefix!: StringContext;
	public _queryExpression!: BooleanExpressionContext;
	public _highlightFields!: QualifiedNamePatternsContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HIGHLIGHT(): TerminalNode {
		return this.getToken(esql_parser.HIGHLIGHT, 0);
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		return this.getTypedRuleContext(QualifiedNamePatternsContext, 0) as QualifiedNamePatternsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_highlightCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterHighlightCommand) {
	 		listener.enterHighlightCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitHighlightCommand) {
	 		listener.exitHighlightCommand(this);
		}
	}
}


export class QualifiedNamesContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public qualifiedName_list(): QualifiedNameContext[] {
		return this.getTypedRuleContexts(QualifiedNameContext) as QualifiedNameContext[];
	}
	public qualifiedName(i: number): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, i) as QualifiedNameContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_qualifiedNames;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterQualifiedNames) {
	 		listener.enterQualifiedNames(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitQualifiedNames) {
	 		listener.exitQualifiedNames(this);
		}
	}
}


export class FillNullCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_FILLNULL(): TerminalNode {
		return this.getToken(esql_parser.DEV_FILLNULL, 0);
	}
	public fillNullValue(): FillNullValueContext {
		return this.getTypedRuleContext(FillNullValueContext, 0) as FillNullValueContext;
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public qualifiedNamePatterns(): QualifiedNamePatternsContext {
		return this.getTypedRuleContext(QualifiedNamePatternsContext, 0) as QualifiedNamePatternsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fillNullCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFillNullCommand) {
	 		listener.enterFillNullCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFillNullCommand) {
	 		listener.exitFillNullCommand(this);
		}
	}
}


export class FillNullValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NULL(): TerminalNode {
		return this.getToken(esql_parser.NULL, 0);
	}
	public DEFAULT(): TerminalNode {
		return this.getToken(esql_parser.DEFAULT, 0);
	}
	public integerValue(): IntegerValueContext {
		return this.getTypedRuleContext(IntegerValueContext, 0) as IntegerValueContext;
	}
	public decimalValue(): DecimalValueContext {
		return this.getTypedRuleContext(DecimalValueContext, 0) as DecimalValueContext;
	}
	public booleanValue(): BooleanValueContext {
		return this.getTypedRuleContext(BooleanValueContext, 0) as BooleanValueContext;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_fillNullValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFillNullValue) {
	 		listener.enterFillNullValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFillNullValue) {
	 		listener.exitFillNullValue(this);
		}
	}
}


export class UriPartsCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public URI_PARTS(): TerminalNode {
		return this.getToken(esql_parser.URI_PARTS, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_uriPartsCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterUriPartsCommand) {
	 		listener.enterUriPartsCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitUriPartsCommand) {
	 		listener.exitUriPartsCommand(this);
		}
	}
}


export class RegisteredDomainCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REGISTERED_DOMAIN(): TerminalNode {
		return this.getToken(esql_parser.REGISTERED_DOMAIN, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_registeredDomainCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRegisteredDomainCommand) {
	 		listener.enterRegisteredDomainCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRegisteredDomainCommand) {
	 		listener.exitRegisteredDomainCommand(this);
		}
	}
}


export class UserAgentCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USER_AGENT(): TerminalNode {
		return this.getToken(esql_parser.USER_AGENT, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_userAgentCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterUserAgentCommand) {
	 		listener.enterUserAgentCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitUserAgentCommand) {
	 		listener.exitUserAgentCommand(this);
		}
	}
}


export class IpLocationCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IP_LOCATION(): TerminalNode {
		return this.getToken(esql_parser.IP_LOCATION, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_ipLocationCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIpLocationCommand) {
	 		listener.enterIpLocationCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIpLocationCommand) {
	 		listener.exitIpLocationCommand(this);
		}
	}
}


export class SetCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SET(): TerminalNode {
		return this.getToken(esql_parser.SET, 0);
	}
	public setField(): SetFieldContext {
		return this.getTypedRuleContext(SetFieldContext, 0) as SetFieldContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(esql_parser.SEMICOLON, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_setCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSetCommand) {
	 		listener.enterSetCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSetCommand) {
	 		listener.exitSetCommand(this);
		}
	}
}


export class SetFieldContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public mapExpression(): MapExpressionContext {
		return this.getTypedRuleContext(MapExpressionContext, 0) as MapExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_setField;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterSetField) {
	 		listener.enterSetField(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitSetField) {
	 		listener.exitSetField(this);
		}
	}
}


export class LetCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEV_LET(): TerminalNode {
		return this.getToken(esql_parser.DEV_LET, 0);
	}
	public letBinding(): LetBindingContext {
		return this.getTypedRuleContext(LetBindingContext, 0) as LetBindingContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(esql_parser.SEMICOLON, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_letCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLetCommand) {
	 		listener.enterLetCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLetCommand) {
	 		listener.exitLetCommand(this);
		}
	}
}


export class LetBindingContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public subquery(): SubqueryContext {
		return this.getTypedRuleContext(SubqueryContext, 0) as SubqueryContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_letBinding;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLetBinding) {
	 		listener.enterLetBinding(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLetBinding) {
	 		listener.exitLetBinding(this);
		}
	}
}


export class MmrCommandContext extends ParserRuleContext {
	public _queryVector!: MmrQueryVectorParamsContext;
	public _diversifyField!: QualifiedNameContext;
	public _limitValue!: IntegerValueContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MMR(): TerminalNode {
		return this.getToken(esql_parser.MMR, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public MMR_LIMIT(): TerminalNode {
		return this.getToken(esql_parser.MMR_LIMIT, 0);
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public integerValue(): IntegerValueContext {
		return this.getTypedRuleContext(IntegerValueContext, 0) as IntegerValueContext;
	}
	public mmrQueryVectorParams(): MmrQueryVectorParamsContext {
		return this.getTypedRuleContext(MmrQueryVectorParamsContext, 0) as MmrQueryVectorParamsContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_mmrCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMmrCommand) {
	 		listener.enterMmrCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMmrCommand) {
	 		listener.exitMmrCommand(this);
		}
	}
}


export class MmrQueryVectorParamsContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_mmrQueryVectorParams;
	}
	public override copyFrom(ctx: MmrQueryVectorParamsContext): void {
		super.copyFrom(ctx);
	}
}
export class MmrQueryVectorParameterContext extends MmrQueryVectorParamsContext {
	constructor(parser: esql_parser, ctx: MmrQueryVectorParamsContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMmrQueryVectorParameter) {
	 		listener.enterMmrQueryVectorParameter(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMmrQueryVectorParameter) {
	 		listener.exitMmrQueryVectorParameter(this);
		}
	}
}
export class MmrQueryVectorExpressionContext extends MmrQueryVectorParamsContext {
	constructor(parser: esql_parser, ctx: MmrQueryVectorParamsContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMmrQueryVectorExpression) {
	 		listener.enterMmrQueryVectorExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMmrQueryVectorExpression) {
	 		listener.exitMmrQueryVectorExpression(this);
		}
	}
}


export class DenseVectorCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DENSE_VECTOR(): TerminalNode {
		return this.getToken(esql_parser.DENSE_VECTOR, 0);
	}
	public commandNamedParameters(): CommandNamedParametersContext {
		return this.getTypedRuleContext(CommandNamedParametersContext, 0) as CommandNamedParametersContext;
	}
	public denseVectorNaming(): DenseVectorNamingContext {
		return this.getTypedRuleContext(DenseVectorNamingContext, 0) as DenseVectorNamingContext;
	}
	public qualifiedNames(): QualifiedNamesContext {
		return this.getTypedRuleContext(QualifiedNamesContext, 0) as QualifiedNamesContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_denseVectorCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDenseVectorCommand) {
	 		listener.enterDenseVectorCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDenseVectorCommand) {
	 		listener.exitDenseVectorCommand(this);
		}
	}
}


export class DenseVectorNamingContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_denseVectorNaming;
	}
	public override copyFrom(ctx: DenseVectorNamingContext): void {
		super.copyFrom(ctx);
	}
}
export class DenseVectorLiteralInputContext extends DenseVectorNamingContext {
	public _targetField!: QualifiedNameContext;
	public _literalInput!: StringContext;
	constructor(parser: esql_parser, ctx: DenseVectorNamingContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDenseVectorLiteralInput) {
	 		listener.enterDenseVectorLiteralInput(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDenseVectorLiteralInput) {
	 		listener.exitDenseVectorLiteralInput(this);
		}
	}
}
export class DenseVectorSuffixContext extends DenseVectorNamingContext {
	public _suffixKeyword!: IdentifierContext;
	public _suffix!: StringContext;
	constructor(parser: esql_parser, ctx: DenseVectorNamingContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDenseVectorSuffix) {
	 		listener.enterDenseVectorSuffix(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDenseVectorSuffix) {
	 		listener.exitDenseVectorSuffix(this);
		}
	}
}
export class DenseVectorTargetNameContext extends DenseVectorNamingContext {
	public _targetField!: QualifiedNameContext;
	constructor(parser: esql_parser, ctx: DenseVectorNamingContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDenseVectorTargetName) {
	 		listener.enterDenseVectorTargetName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDenseVectorTargetName) {
	 		listener.exitDenseVectorTargetName(this);
		}
	}
}


export class BooleanExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_booleanExpression;
	}
	public override copyFrom(ctx: BooleanExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class MatchExpressionContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public matchBooleanExpression(): MatchBooleanExpressionContext {
		return this.getTypedRuleContext(MatchBooleanExpressionContext, 0) as MatchBooleanExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMatchExpression) {
	 		listener.enterMatchExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMatchExpression) {
	 		listener.exitMatchExpression(this);
		}
	}
}
export class LogicalNotContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLogicalNot) {
	 		listener.enterLogicalNot(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLogicalNot) {
	 		listener.exitLogicalNot(this);
		}
	}
}
export class BooleanDefaultContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterBooleanDefault) {
	 		listener.enterBooleanDefault(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitBooleanDefault) {
	 		listener.exitBooleanDefault(this);
		}
	}
}
export class LogicalInMultiColumnSubqueryContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public valueExpression_list(): ValueExpressionContext[] {
		return this.getTypedRuleContexts(ValueExpressionContext) as ValueExpressionContext[];
	}
	public valueExpression(i: number): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, i) as ValueExpressionContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(esql_parser.IN, 0);
	}
	public subquery(): SubqueryContext {
		return this.getTypedRuleContext(SubqueryContext, 0) as SubqueryContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLogicalInMultiColumnSubquery) {
	 		listener.enterLogicalInMultiColumnSubquery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLogicalInMultiColumnSubquery) {
	 		listener.exitLogicalInMultiColumnSubquery(this);
		}
	}
}
export class IsNullContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public IS(): TerminalNode {
		return this.getToken(esql_parser.IS, 0);
	}
	public NULL(): TerminalNode {
		return this.getToken(esql_parser.NULL, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIsNull) {
	 		listener.enterIsNull(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIsNull) {
	 		listener.exitIsNull(this);
		}
	}
}
export class LogicalInSubqueryContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public IN(): TerminalNode {
		return this.getToken(esql_parser.IN, 0);
	}
	public subquery(): SubqueryContext {
		return this.getTypedRuleContext(SubqueryContext, 0) as SubqueryContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLogicalInSubquery) {
	 		listener.enterLogicalInSubquery(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLogicalInSubquery) {
	 		listener.exitLogicalInSubquery(this);
		}
	}
}
export class RegexExpressionContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public regexBooleanExpression(): RegexBooleanExpressionContext {
		return this.getTypedRuleContext(RegexBooleanExpressionContext, 0) as RegexBooleanExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRegexExpression) {
	 		listener.enterRegexExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRegexExpression) {
	 		listener.exitRegexExpression(this);
		}
	}
}
export class LogicalInContext extends BooleanExpressionContext {
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression_list(): ValueExpressionContext[] {
		return this.getTypedRuleContexts(ValueExpressionContext) as ValueExpressionContext[];
	}
	public valueExpression(i: number): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, i) as ValueExpressionContext;
	}
	public IN(): TerminalNode {
		return this.getToken(esql_parser.IN, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLogicalIn) {
	 		listener.enterLogicalIn(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLogicalIn) {
	 		listener.exitLogicalIn(this);
		}
	}
}
export class LogicalBinaryContext extends BooleanExpressionContext {
	public _left!: BooleanExpressionContext;
	public _operator!: Token;
	public _right!: BooleanExpressionContext;
	constructor(parser: esql_parser, ctx: BooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public booleanExpression_list(): BooleanExpressionContext[] {
		return this.getTypedRuleContexts(BooleanExpressionContext) as BooleanExpressionContext[];
	}
	public booleanExpression(i: number): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, i) as BooleanExpressionContext;
	}
	public AND(): TerminalNode {
		return this.getToken(esql_parser.AND, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(esql_parser.OR, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLogicalBinary) {
	 		listener.enterLogicalBinary(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLogicalBinary) {
	 		listener.exitLogicalBinary(this);
		}
	}
}


export class RegexBooleanExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_regexBooleanExpression;
	}
	public override copyFrom(ctx: RegexBooleanExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class LikeExpressionContext extends RegexBooleanExpressionContext {
	constructor(parser: esql_parser, ctx: RegexBooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public LIKE(): TerminalNode {
		return this.getToken(esql_parser.LIKE, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLikeExpression) {
	 		listener.enterLikeExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLikeExpression) {
	 		listener.exitLikeExpression(this);
		}
	}
}
export class LikeListExpressionContext extends RegexBooleanExpressionContext {
	constructor(parser: esql_parser, ctx: RegexBooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public LIKE(): TerminalNode {
		return this.getToken(esql_parser.LIKE, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public stringOrParameter_list(): StringOrParameterContext[] {
		return this.getTypedRuleContexts(StringOrParameterContext) as StringOrParameterContext[];
	}
	public stringOrParameter(i: number): StringOrParameterContext {
		return this.getTypedRuleContext(StringOrParameterContext, i) as StringOrParameterContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLikeListExpression) {
	 		listener.enterLikeListExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLikeListExpression) {
	 		listener.exitLikeListExpression(this);
		}
	}
}
export class RlikeExpressionContext extends RegexBooleanExpressionContext {
	constructor(parser: esql_parser, ctx: RegexBooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public RLIKE(): TerminalNode {
		return this.getToken(esql_parser.RLIKE, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRlikeExpression) {
	 		listener.enterRlikeExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRlikeExpression) {
	 		listener.exitRlikeExpression(this);
		}
	}
}
export class RlikeListExpressionContext extends RegexBooleanExpressionContext {
	constructor(parser: esql_parser, ctx: RegexBooleanExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueExpression(): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, 0) as ValueExpressionContext;
	}
	public RLIKE(): TerminalNode {
		return this.getToken(esql_parser.RLIKE, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public stringOrParameter_list(): StringOrParameterContext[] {
		return this.getTypedRuleContexts(StringOrParameterContext) as StringOrParameterContext[];
	}
	public stringOrParameter(i: number): StringOrParameterContext {
		return this.getTypedRuleContext(StringOrParameterContext, i) as StringOrParameterContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(esql_parser.NOT, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterRlikeListExpression) {
	 		listener.enterRlikeListExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitRlikeListExpression) {
	 		listener.exitRlikeListExpression(this);
		}
	}
}


export class MatchBooleanExpressionContext extends ParserRuleContext {
	public _fieldExp!: PrimaryExpressionContext;
	public _matchQuery!: ConstantContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLON(): TerminalNode {
		return this.getToken(esql_parser.COLON, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_matchBooleanExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMatchBooleanExpression) {
	 		listener.enterMatchBooleanExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMatchBooleanExpression) {
	 		listener.exitMatchBooleanExpression(this);
		}
	}
}


export class ValueExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_valueExpression;
	}
	public override copyFrom(ctx: ValueExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class ValueExpressionDefaultContext extends ValueExpressionContext {
	constructor(parser: esql_parser, ctx: ValueExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public operatorExpression(): OperatorExpressionContext {
		return this.getTypedRuleContext(OperatorExpressionContext, 0) as OperatorExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterValueExpressionDefault) {
	 		listener.enterValueExpressionDefault(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitValueExpressionDefault) {
	 		listener.exitValueExpressionDefault(this);
		}
	}
}
export class ComparisonContext extends ValueExpressionContext {
	public _left!: OperatorExpressionContext;
	public _right!: OperatorExpressionContext;
	constructor(parser: esql_parser, ctx: ValueExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonOperator(): ComparisonOperatorContext {
		return this.getTypedRuleContext(ComparisonOperatorContext, 0) as ComparisonOperatorContext;
	}
	public operatorExpression_list(): OperatorExpressionContext[] {
		return this.getTypedRuleContexts(OperatorExpressionContext) as OperatorExpressionContext[];
	}
	public operatorExpression(i: number): OperatorExpressionContext {
		return this.getTypedRuleContext(OperatorExpressionContext, i) as OperatorExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterComparison) {
	 		listener.enterComparison(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitComparison) {
	 		listener.exitComparison(this);
		}
	}
}


export class OperatorExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_operatorExpression;
	}
	public override copyFrom(ctx: OperatorExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class OperatorExpressionDefaultContext extends OperatorExpressionContext {
	constructor(parser: esql_parser, ctx: OperatorExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterOperatorExpressionDefault) {
	 		listener.enterOperatorExpressionDefault(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitOperatorExpressionDefault) {
	 		listener.exitOperatorExpressionDefault(this);
		}
	}
}
export class ArithmeticBinaryContext extends OperatorExpressionContext {
	public _left!: OperatorExpressionContext;
	public _operator!: Token;
	public _right!: OperatorExpressionContext;
	constructor(parser: esql_parser, ctx: OperatorExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public operatorExpression_list(): OperatorExpressionContext[] {
		return this.getTypedRuleContexts(OperatorExpressionContext) as OperatorExpressionContext[];
	}
	public operatorExpression(i: number): OperatorExpressionContext {
		return this.getTypedRuleContext(OperatorExpressionContext, i) as OperatorExpressionContext;
	}
	public ASTERISK(): TerminalNode {
		return this.getToken(esql_parser.ASTERISK, 0);
	}
	public SLASH(): TerminalNode {
		return this.getToken(esql_parser.SLASH, 0);
	}
	public PERCENT(): TerminalNode {
		return this.getToken(esql_parser.PERCENT, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(esql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(esql_parser.MINUS, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterArithmeticBinary) {
	 		listener.enterArithmeticBinary(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitArithmeticBinary) {
	 		listener.exitArithmeticBinary(this);
		}
	}
}
export class ArithmeticUnaryContext extends OperatorExpressionContext {
	public _operator!: Token;
	constructor(parser: esql_parser, ctx: OperatorExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public operatorExpression(): OperatorExpressionContext {
		return this.getTypedRuleContext(OperatorExpressionContext, 0) as OperatorExpressionContext;
	}
	public MINUS(): TerminalNode {
		return this.getToken(esql_parser.MINUS, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(esql_parser.PLUS, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterArithmeticUnary) {
	 		listener.enterArithmeticUnary(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitArithmeticUnary) {
	 		listener.exitArithmeticUnary(this);
		}
	}
}


export class PrimaryExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_primaryExpression;
	}
	public override copyFrom(ctx: PrimaryExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class DereferenceContext extends PrimaryExpressionContext {
	constructor(parser: esql_parser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public qualifiedName(): QualifiedNameContext {
		return this.getTypedRuleContext(QualifiedNameContext, 0) as QualifiedNameContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDereference) {
	 		listener.enterDereference(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDereference) {
	 		listener.exitDereference(this);
		}
	}
}
export class InlineCastContext extends PrimaryExpressionContext {
	constructor(parser: esql_parser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public CAST_OP(): TerminalNode {
		return this.getToken(esql_parser.CAST_OP, 0);
	}
	public dataType(): DataTypeContext {
		return this.getTypedRuleContext(DataTypeContext, 0) as DataTypeContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInlineCast) {
	 		listener.enterInlineCast(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInlineCast) {
	 		listener.exitInlineCast(this);
		}
	}
}
export class ConstantDefaultContext extends PrimaryExpressionContext {
	constructor(parser: esql_parser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterConstantDefault) {
	 		listener.enterConstantDefault(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitConstantDefault) {
	 		listener.exitConstantDefault(this);
		}
	}
}
export class ParenthesizedExpressionContext extends PrimaryExpressionContext {
	constructor(parser: esql_parser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterParenthesizedExpression) {
	 		listener.enterParenthesizedExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitParenthesizedExpression) {
	 		listener.exitParenthesizedExpression(this);
		}
	}
}
export class FunctionContext extends PrimaryExpressionContext {
	constructor(parser: esql_parser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public functionExpression(): FunctionExpressionContext {
		return this.getTypedRuleContext(FunctionExpressionContext, 0) as FunctionExpressionContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFunction) {
	 		listener.enterFunction(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFunction) {
	 		listener.exitFunction(this);
		}
	}
}


export class FunctionExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public functionName(): FunctionNameContext {
		return this.getTypedRuleContext(FunctionNameContext, 0) as FunctionNameContext;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public ASTERISK(): TerminalNode {
		return this.getToken(esql_parser.ASTERISK, 0);
	}
	public booleanExpression_list(): BooleanExpressionContext[] {
		return this.getTypedRuleContexts(BooleanExpressionContext) as BooleanExpressionContext[];
	}
	public booleanExpression(i: number): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, i) as BooleanExpressionContext;
	}
	public lambda_list(): LambdaContext[] {
		return this.getTypedRuleContexts(LambdaContext) as LambdaContext[];
	}
	public lambda(i: number): LambdaContext {
		return this.getTypedRuleContext(LambdaContext, i) as LambdaContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public mapExpression(): MapExpressionContext {
		return this.getTypedRuleContext(MapExpressionContext, 0) as MapExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_functionExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFunctionExpression) {
	 		listener.enterFunctionExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFunctionExpression) {
	 		listener.exitFunctionExpression(this);
		}
	}
}


export class FunctionNameContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrParameter(): IdentifierOrParameterContext {
		return this.getTypedRuleContext(IdentifierOrParameterContext, 0) as IdentifierOrParameterContext;
	}
	public FIRST(): TerminalNode {
		return this.getToken(esql_parser.FIRST, 0);
	}
	public LAST(): TerminalNode {
		return this.getToken(esql_parser.LAST, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_functionName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterFunctionName) {
	 		listener.enterFunctionName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitFunctionName) {
	 		listener.exitFunctionName(this);
		}
	}
}


export class LambdaContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public ARROW(): TerminalNode {
		return this.getToken(esql_parser.ARROW, 0);
	}
	public booleanExpression(): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, 0) as BooleanExpressionContext;
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_lambda;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterLambda) {
	 		listener.enterLambda(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitLambda) {
	 		listener.exitLambda(this);
		}
	}
}


export class MapExpressionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LEFT_BRACES(): TerminalNode {
		return this.getToken(esql_parser.LEFT_BRACES, 0);
	}
	public RIGHT_BRACES(): TerminalNode {
		return this.getToken(esql_parser.RIGHT_BRACES, 0);
	}
	public entryExpression_list(): EntryExpressionContext[] {
		return this.getTypedRuleContexts(EntryExpressionContext) as EntryExpressionContext[];
	}
	public entryExpression(i: number): EntryExpressionContext {
		return this.getTypedRuleContext(EntryExpressionContext, i) as EntryExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_mapExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMapExpression) {
	 		listener.enterMapExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMapExpression) {
	 		listener.exitMapExpression(this);
		}
	}
}


export class EntryExpressionContext extends ParserRuleContext {
	public _key!: StringContext;
	public _value!: MapValueContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLON(): TerminalNode {
		return this.getToken(esql_parser.COLON, 0);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public mapValue(): MapValueContext {
		return this.getTypedRuleContext(MapValueContext, 0) as MapValueContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_entryExpression;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterEntryExpression) {
	 		listener.enterEntryExpression(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitEntryExpression) {
	 		listener.exitEntryExpression(this);
		}
	}
}


export class MapValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public mapExpression(): MapExpressionContext {
		return this.getTypedRuleContext(MapExpressionContext, 0) as MapExpressionContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_mapValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterMapValue) {
	 		listener.enterMapValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitMapValue) {
	 		listener.exitMapValue(this);
		}
	}
}


export class ConstantContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_constant;
	}
	public override copyFrom(ctx: ConstantContext): void {
		super.copyFrom(ctx);
	}
}
export class BooleanArrayLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPENING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.OPENING_BRACKET, 0);
	}
	public booleanValue_list(): BooleanValueContext[] {
		return this.getTypedRuleContexts(BooleanValueContext) as BooleanValueContext[];
	}
	public booleanValue(i: number): BooleanValueContext {
		return this.getTypedRuleContext(BooleanValueContext, i) as BooleanValueContext;
	}
	public CLOSING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.CLOSING_BRACKET, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterBooleanArrayLiteral) {
	 		listener.enterBooleanArrayLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitBooleanArrayLiteral) {
	 		listener.exitBooleanArrayLiteral(this);
		}
	}
}
export class DecimalLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public decimalValue(): DecimalValueContext {
		return this.getTypedRuleContext(DecimalValueContext, 0) as DecimalValueContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDecimalLiteral) {
	 		listener.enterDecimalLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDecimalLiteral) {
	 		listener.exitDecimalLiteral(this);
		}
	}
}
export class NullLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NULL(): TerminalNode {
		return this.getToken(esql_parser.NULL, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterNullLiteral) {
	 		listener.enterNullLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitNullLiteral) {
	 		listener.exitNullLiteral(this);
		}
	}
}
export class QualifiedIntegerLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public integerValue(): IntegerValueContext {
		return this.getTypedRuleContext(IntegerValueContext, 0) as IntegerValueContext;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterQualifiedIntegerLiteral) {
	 		listener.enterQualifiedIntegerLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitQualifiedIntegerLiteral) {
	 		listener.exitQualifiedIntegerLiteral(this);
		}
	}
}
export class StringArrayLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPENING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.OPENING_BRACKET, 0);
	}
	public string__list(): StringContext[] {
		return this.getTypedRuleContexts(StringContext) as StringContext[];
	}
	public string_(i: number): StringContext {
		return this.getTypedRuleContext(StringContext, i) as StringContext;
	}
	public CLOSING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.CLOSING_BRACKET, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterStringArrayLiteral) {
	 		listener.enterStringArrayLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitStringArrayLiteral) {
	 		listener.exitStringArrayLiteral(this);
		}
	}
}
export class InputParameterContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public parameter(): ParameterContext {
		return this.getTypedRuleContext(ParameterContext, 0) as ParameterContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterInputParameter) {
	 		listener.enterInputParameter(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitInputParameter) {
	 		listener.exitInputParameter(this);
		}
	}
}
export class StringLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterStringLiteral) {
	 		listener.enterStringLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitStringLiteral) {
	 		listener.exitStringLiteral(this);
		}
	}
}
export class NumericArrayLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPENING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.OPENING_BRACKET, 0);
	}
	public numericValue_list(): NumericValueContext[] {
		return this.getTypedRuleContexts(NumericValueContext) as NumericValueContext[];
	}
	public numericValue(i: number): NumericValueContext {
		return this.getTypedRuleContext(NumericValueContext, i) as NumericValueContext;
	}
	public CLOSING_BRACKET(): TerminalNode {
		return this.getToken(esql_parser.CLOSING_BRACKET, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterNumericArrayLiteral) {
	 		listener.enterNumericArrayLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitNumericArrayLiteral) {
	 		listener.exitNumericArrayLiteral(this);
		}
	}
}
export class IntegerLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public integerValue(): IntegerValueContext {
		return this.getTypedRuleContext(IntegerValueContext, 0) as IntegerValueContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIntegerLiteral) {
	 		listener.enterIntegerLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIntegerLiteral) {
	 		listener.exitIntegerLiteral(this);
		}
	}
}
export class BooleanLiteralContext extends ConstantContext {
	constructor(parser: esql_parser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public booleanValue(): BooleanValueContext {
		return this.getTypedRuleContext(BooleanValueContext, 0) as BooleanValueContext;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterBooleanLiteral) {
	 		listener.enterBooleanLiteral(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitBooleanLiteral) {
	 		listener.exitBooleanLiteral(this);
		}
	}
}


export class BooleanValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TRUE(): TerminalNode {
		return this.getToken(esql_parser.TRUE, 0);
	}
	public FALSE(): TerminalNode {
		return this.getToken(esql_parser.FALSE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_booleanValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterBooleanValue) {
	 		listener.enterBooleanValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitBooleanValue) {
	 		listener.exitBooleanValue(this);
		}
	}
}


export class NumericValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public decimalValue(): DecimalValueContext {
		return this.getTypedRuleContext(DecimalValueContext, 0) as DecimalValueContext;
	}
	public integerValue(): IntegerValueContext {
		return this.getTypedRuleContext(IntegerValueContext, 0) as IntegerValueContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_numericValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterNumericValue) {
	 		listener.enterNumericValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitNumericValue) {
	 		listener.exitNumericValue(this);
		}
	}
}


export class DecimalValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DECIMAL_LITERAL(): TerminalNode {
		return this.getToken(esql_parser.DECIMAL_LITERAL, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(esql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(esql_parser.MINUS, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_decimalValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterDecimalValue) {
	 		listener.enterDecimalValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitDecimalValue) {
	 		listener.exitDecimalValue(this);
		}
	}
}


export class IntegerValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INTEGER_LITERAL(): TerminalNode {
		return this.getToken(esql_parser.INTEGER_LITERAL, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(esql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(esql_parser.MINUS, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_integerValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterIntegerValue) {
	 		listener.enterIntegerValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitIntegerValue) {
	 		listener.exitIntegerValue(this);
		}
	}
}


export class StringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_string;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterString) {
	 		listener.enterString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitString) {
	 		listener.exitString(this);
		}
	}
}


export class ComparisonOperatorContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EQ(): TerminalNode {
		return this.getToken(esql_parser.EQ, 0);
	}
	public NEQ(): TerminalNode {
		return this.getToken(esql_parser.NEQ, 0);
	}
	public LT(): TerminalNode {
		return this.getToken(esql_parser.LT, 0);
	}
	public LTE(): TerminalNode {
		return this.getToken(esql_parser.LTE, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(esql_parser.GT, 0);
	}
	public GTE(): TerminalNode {
		return this.getToken(esql_parser.GTE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_comparisonOperator;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterComparisonOperator) {
	 		listener.enterComparisonOperator(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitComparisonOperator) {
	 		listener.exitComparisonOperator(this);
		}
	}
}


export class JoinCommandContext extends ParserRuleContext {
	public _type_!: Token;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public JOIN(): TerminalNode {
		return this.getToken(esql_parser.JOIN, 0);
	}
	public joinTarget(): JoinTargetContext {
		return this.getTypedRuleContext(JoinTargetContext, 0) as JoinTargetContext;
	}
	public joinCondition(): JoinConditionContext {
		return this.getTypedRuleContext(JoinConditionContext, 0) as JoinConditionContext;
	}
	public JOIN_LOOKUP(): TerminalNode {
		return this.getToken(esql_parser.JOIN_LOOKUP, 0);
	}
	public DEV_JOIN_LEFT(): TerminalNode {
		return this.getToken(esql_parser.DEV_JOIN_LEFT, 0);
	}
	public DEV_JOIN_RIGHT(): TerminalNode {
		return this.getToken(esql_parser.DEV_JOIN_RIGHT, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_joinCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterJoinCommand) {
	 		listener.enterJoinCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitJoinCommand) {
	 		listener.exitJoinCommand(this);
		}
	}
}


export class JoinTargetContext extends ParserRuleContext {
	public _index!: IndexPatternContext;
	public _qualifier!: Token;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public indexPattern(): IndexPatternContext {
		return this.getTypedRuleContext(IndexPatternContext, 0) as IndexPatternContext;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
	public AS(): TerminalNode {
		return this.getToken(esql_parser.AS, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_joinTarget;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterJoinTarget) {
	 		listener.enterJoinTarget(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitJoinTarget) {
	 		listener.exitJoinTarget(this);
		}
	}
}


export class JoinConditionContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ON(): TerminalNode {
		return this.getToken(esql_parser.ON, 0);
	}
	public booleanExpression_list(): BooleanExpressionContext[] {
		return this.getTypedRuleContexts(BooleanExpressionContext) as BooleanExpressionContext[];
	}
	public booleanExpression(i: number): BooleanExpressionContext {
		return this.getTypedRuleContext(BooleanExpressionContext, i) as BooleanExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_joinCondition;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterJoinCondition) {
	 		listener.enterJoinCondition(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitJoinCondition) {
	 		listener.exitJoinCondition(this);
		}
	}
}


export class PromqlCommandContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PROMQL(): TerminalNode {
		return this.getToken(esql_parser.PROMQL, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public promqlParam_list(): PromqlParamContext[] {
		return this.getTypedRuleContexts(PromqlParamContext) as PromqlParamContext[];
	}
	public promqlParam(i: number): PromqlParamContext {
		return this.getTypedRuleContext(PromqlParamContext, i) as PromqlParamContext;
	}
	public valueName(): ValueNameContext {
		return this.getTypedRuleContext(ValueNameContext, 0) as ValueNameContext;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public promqlQueryPart_list(): PromqlQueryPartContext[] {
		return this.getTypedRuleContexts(PromqlQueryPartContext) as PromqlQueryPartContext[];
	}
	public promqlQueryPart(i: number): PromqlQueryPartContext {
		return this.getTypedRuleContext(PromqlQueryPartContext, i) as PromqlQueryPartContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlCommand;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlCommand) {
	 		listener.enterPromqlCommand(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlCommand) {
	 		listener.exitPromqlCommand(this);
		}
	}
}


export class ValueNameContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public QUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_valueName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterValueName) {
	 		listener.enterValueName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitValueName) {
	 		listener.exitValueName(this);
		}
	}
}


export class PromqlParamContext extends ParserRuleContext {
	public _name!: PromqlParamNameContext;
	public _value!: PromqlParamValueContext;
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public promqlParamName(): PromqlParamNameContext {
		return this.getTypedRuleContext(PromqlParamNameContext, 0) as PromqlParamNameContext;
	}
	public promqlParamValue(): PromqlParamValueContext {
		return this.getTypedRuleContext(PromqlParamValueContext, 0) as PromqlParamValueContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlParam;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlParam) {
	 		listener.enterPromqlParam(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlParam) {
	 		listener.exitPromqlParam(this);
		}
	}
}


export class PromqlParamNameContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public QUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_IDENTIFIER, 0);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlParamName;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlParamName) {
	 		listener.enterPromqlParamName(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlParamName) {
	 		listener.exitPromqlParamName(this);
		}
	}
}


export class PromqlParamValueContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public promqlIndexPattern_list(): PromqlIndexPatternContext[] {
		return this.getTypedRuleContexts(PromqlIndexPatternContext) as PromqlIndexPatternContext[];
	}
	public promqlIndexPattern(i: number): PromqlIndexPatternContext {
		return this.getTypedRuleContext(PromqlIndexPatternContext, i) as PromqlIndexPatternContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(esql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(esql_parser.COMMA, i);
	}
	public QUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_IDENTIFIER, 0);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlParamValue;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlParamValue) {
	 		listener.enterPromqlParamValue(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlParamValue) {
	 		listener.exitPromqlParamValue(this);
		}
	}
}


export class PromqlQueryContentContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
	public QUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_IDENTIFIER, 0);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(esql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
	public PROMQL_QUERY_COMMENT(): TerminalNode {
		return this.getToken(esql_parser.PROMQL_QUERY_COMMENT, 0);
	}
	public PROMQL_SINGLE_QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.PROMQL_SINGLE_QUOTED_STRING, 0);
	}
	public ASSIGN(): TerminalNode {
		return this.getToken(esql_parser.ASSIGN, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(esql_parser.COMMA, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(esql_parser.COLON, 0);
	}
	public CAST_OP(): TerminalNode {
		return this.getToken(esql_parser.CAST_OP, 0);
	}
	public PROMQL_OTHER_QUERY_CONTENT(): TerminalNode {
		return this.getToken(esql_parser.PROMQL_OTHER_QUERY_CONTENT, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlQueryContent;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlQueryContent) {
	 		listener.enterPromqlQueryContent(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlQueryContent) {
	 		listener.exitPromqlQueryContent(this);
		}
	}
}


export class PromqlQueryPartContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public promqlQueryContent_list(): PromqlQueryContentContext[] {
		return this.getTypedRuleContexts(PromqlQueryContentContext) as PromqlQueryContentContext[];
	}
	public promqlQueryContent(i: number): PromqlQueryContentContext {
		return this.getTypedRuleContext(PromqlQueryContentContext, i) as PromqlQueryContentContext;
	}
	public LP(): TerminalNode {
		return this.getToken(esql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(esql_parser.RP, 0);
	}
	public promqlQueryPart_list(): PromqlQueryPartContext[] {
		return this.getTypedRuleContexts(PromqlQueryPartContext) as PromqlQueryPartContext[];
	}
	public promqlQueryPart(i: number): PromqlQueryPartContext {
		return this.getTypedRuleContext(PromqlQueryPartContext, i) as PromqlQueryPartContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlQueryPart;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlQueryPart) {
	 		listener.enterPromqlQueryPart(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlQueryPart) {
	 		listener.exitPromqlQueryPart(this);
		}
	}
}


export class PromqlIndexPatternContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public promqlClusterString(): PromqlClusterStringContext {
		return this.getTypedRuleContext(PromqlClusterStringContext, 0) as PromqlClusterStringContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(esql_parser.COLON, 0);
	}
	public promqlUnquotedIndexString(): PromqlUnquotedIndexStringContext {
		return this.getTypedRuleContext(PromqlUnquotedIndexStringContext, 0) as PromqlUnquotedIndexStringContext;
	}
	public CAST_OP(): TerminalNode {
		return this.getToken(esql_parser.CAST_OP, 0);
	}
	public promqlSelectorString(): PromqlSelectorStringContext {
		return this.getTypedRuleContext(PromqlSelectorStringContext, 0) as PromqlSelectorStringContext;
	}
	public promqlIndexString(): PromqlIndexStringContext {
		return this.getTypedRuleContext(PromqlIndexStringContext, 0) as PromqlIndexStringContext;
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlIndexPattern;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlIndexPattern) {
	 		listener.enterPromqlIndexPattern(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlIndexPattern) {
	 		listener.exitPromqlIndexPattern(this);
		}
	}
}


export class PromqlClusterStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlClusterString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlClusterString) {
	 		listener.enterPromqlClusterString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlClusterString) {
	 		listener.exitPromqlClusterString(this);
		}
	}
}


export class PromqlSelectorStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlSelectorString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlSelectorString) {
	 		listener.enterPromqlSelectorString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlSelectorString) {
	 		listener.exitPromqlSelectorString(this);
		}
	}
}


export class PromqlUnquotedIndexStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlUnquotedIndexString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlUnquotedIndexString) {
	 		listener.enterPromqlUnquotedIndexString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlUnquotedIndexString) {
	 		listener.exitPromqlUnquotedIndexString(this);
		}
	}
}


export class PromqlIndexStringContext extends ParserRuleContext {
	constructor(parser?: esql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNQUOTED_IDENTIFIER(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_IDENTIFIER, 0);
	}
	public UNQUOTED_SOURCE(): TerminalNode {
		return this.getToken(esql_parser.UNQUOTED_SOURCE, 0);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(esql_parser.QUOTED_STRING, 0);
	}
    public get ruleIndex(): number {
    	return esql_parser.RULE_promqlIndexString;
	}
	public enterRule(listener: esql_parserListener): void {
	    if(listener.enterPromqlIndexString) {
	 		listener.enterPromqlIndexString(this);
		}
	}
	public exitRule(listener: esql_parserListener): void {
	    if(listener.exitPromqlIndexString) {
	 		listener.exitPromqlIndexString(this);
		}
	}
}
