// @ts-nocheck
// Generated from src/promql_parser.g4 by ANTLR 4.13.2
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
import promql_parserListener from "./promql_parserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import parser_config from './parser_config.js';

export default class promql_parser extends parser_config {
	public static readonly PLUS = 1;
	public static readonly MINUS = 2;
	public static readonly ASTERISK = 3;
	public static readonly SLASH = 4;
	public static readonly PERCENT = 5;
	public static readonly CARET = 6;
	public static readonly EQ = 7;
	public static readonly NEQ = 8;
	public static readonly GT = 9;
	public static readonly GTE = 10;
	public static readonly LT = 11;
	public static readonly LTE = 12;
	public static readonly LABEL_EQ = 13;
	public static readonly LABEL_RGX = 14;
	public static readonly LABEL_RGX_NEQ = 15;
	public static readonly AND = 16;
	public static readonly OR = 17;
	public static readonly UNLESS = 18;
	public static readonly BY = 19;
	public static readonly WITHOUT = 20;
	public static readonly ON = 21;
	public static readonly IGNORING = 22;
	public static readonly GROUP_LEFT = 23;
	public static readonly GROUP_RIGHT = 24;
	public static readonly BOOL = 25;
	public static readonly OFFSET = 26;
	public static readonly AT = 27;
	public static readonly AT_START = 28;
	public static readonly AT_END = 29;
	public static readonly LCB = 30;
	public static readonly RCB = 31;
	public static readonly LSB = 32;
	public static readonly RSB = 33;
	public static readonly LP = 34;
	public static readonly RP = 35;
	public static readonly COLON = 36;
	public static readonly COMMA = 37;
	public static readonly STRING = 38;
	public static readonly INTEGER_VALUE = 39;
	public static readonly DECIMAL_VALUE = 40;
	public static readonly INF_OR_NAN = 41;
	public static readonly HEXADECIMAL = 42;
	public static readonly TIME_VALUE = 43;
	public static readonly IDENTIFIER = 44;
	public static readonly NAMED_OR_POSITIONAL_DOUBLE_PARAMS = 45;
	public static readonly NAMED_OR_POSITIONAL_PARAM = 46;
	public static readonly COMMENT = 47;
	public static readonly WS = 48;
	public static readonly UNRECOGNIZED = 49;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_singleStatement = 0;
	public static readonly RULE_expression = 1;
	public static readonly RULE_subqueryResolution = 2;
	public static readonly RULE_value = 3;
	public static readonly RULE_function = 4;
	public static readonly RULE_functionParams = 5;
	public static readonly RULE_grouping = 6;
	public static readonly RULE_selector = 7;
	public static readonly RULE_seriesMatcher = 8;
	public static readonly RULE_modifier = 9;
	public static readonly RULE_labelList = 10;
	public static readonly RULE_labelListItem = 11;
	public static readonly RULE_labels = 12;
	public static readonly RULE_label = 13;
	public static readonly RULE_labelValue = 14;
	public static readonly RULE_labelName = 15;
	public static readonly RULE_identifier = 16;
	public static readonly RULE_metricName = 17;
	public static readonly RULE_groupingLabel = 18;
	public static readonly RULE_evaluation = 19;
	public static readonly RULE_offset = 20;
	public static readonly RULE_duration = 21;
	public static readonly RULE_at = 22;
	public static readonly RULE_constant = 23;
	public static readonly RULE_number = 24;
	public static readonly RULE_string = 25;
	public static readonly RULE_timeValue = 26;
	public static readonly RULE_nonReserved = 27;
	public static readonly literalNames: (string | null)[] = [ null, "'+'", 
                                                            "'-'", "'*'", 
                                                            "'/'", "'%'", 
                                                            "'^'", "'=='", 
                                                            "'!='", "'>'", 
                                                            "'>='", "'<'", 
                                                            "'<='", "'='", 
                                                            "'=~'", "'!~'", 
                                                            "'and'", "'or'", 
                                                            "'unless'", 
                                                            "'by'", "'without'", 
                                                            "'on'", "'ignoring'", 
                                                            "'group_left'", 
                                                            "'group_right'", 
                                                            "'bool'", "'offset'", 
                                                            "'@'", null, 
                                                            null, "'{'", 
                                                            "'}'", "'['", 
                                                            "']'", "'('", 
                                                            "')'", "':'", 
                                                            "','" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "PLUS", 
                                                             "MINUS", "ASTERISK", 
                                                             "SLASH", "PERCENT", 
                                                             "CARET", "EQ", 
                                                             "NEQ", "GT", 
                                                             "GTE", "LT", 
                                                             "LTE", "LABEL_EQ", 
                                                             "LABEL_RGX", 
                                                             "LABEL_RGX_NEQ", 
                                                             "AND", "OR", 
                                                             "UNLESS", "BY", 
                                                             "WITHOUT", 
                                                             "ON", "IGNORING", 
                                                             "GROUP_LEFT", 
                                                             "GROUP_RIGHT", 
                                                             "BOOL", "OFFSET", 
                                                             "AT", "AT_START", 
                                                             "AT_END", "LCB", 
                                                             "RCB", "LSB", 
                                                             "RSB", "LP", 
                                                             "RP", "COLON", 
                                                             "COMMA", "STRING", 
                                                             "INTEGER_VALUE", 
                                                             "DECIMAL_VALUE", 
                                                             "INF_OR_NAN", 
                                                             "HEXADECIMAL", 
                                                             "TIME_VALUE", 
                                                             "IDENTIFIER", 
                                                             "NAMED_OR_POSITIONAL_DOUBLE_PARAMS", 
                                                             "NAMED_OR_POSITIONAL_PARAM", 
                                                             "COMMENT", 
                                                             "WS", "UNRECOGNIZED" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"singleStatement", "expression", "subqueryResolution", "value", "function", 
		"functionParams", "grouping", "selector", "seriesMatcher", "modifier", 
		"labelList", "labelListItem", "labels", "label", "labelValue", "labelName", 
		"identifier", "metricName", "groupingLabel", "evaluation", "offset", "duration", 
		"at", "constant", "number", "string", "timeValue", "nonReserved",
	];
	public get grammarFileName(): string { return "promql_parser.g4"; }
	public get literalNames(): (string | null)[] { return promql_parser.literalNames; }
	public get symbolicNames(): (string | null)[] { return promql_parser.symbolicNames; }
	public get ruleNames(): string[] { return promql_parser.ruleNames; }
	public get serializedATN(): number[] { return promql_parser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, promql_parser._ATN, promql_parser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public singleStatement(): SingleStatementContext {
		let localctx: SingleStatementContext = new SingleStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, promql_parser.RULE_singleStatement);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 56;
			this.expression(0);
			this.state = 57;
			this.match(promql_parser.EOF);
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

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, _parentState);
		let _prevctx: ExpressionContext = localctx;
		let _startState: number = 2;
		this.enterRecursionRule(localctx, 2, promql_parser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 67;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
				{
				localctx = new ArithmeticUnaryContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 60;
				(localctx as ArithmeticUnaryContext)._operator = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===1 || _la===2)) {
				    (localctx as ArithmeticUnaryContext)._operator = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 61;
				this.expression(9);
				}
				break;
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 26:
			case 30:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 46:
				{
				localctx = new ValueExpressionContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 62;
				this.value();
				}
				break;
			case 34:
				{
				localctx = new ParenthesizedContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 63;
				this.match(promql_parser.LP);
				this.state = 64;
				this.expression(0);
				this.state = 65;
				this.match(promql_parser.RP);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 118;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 116;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 9, this._ctx) ) {
					case 1:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 69;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 70;
						(localctx as ArithmeticBinaryContext)._op = this.match(promql_parser.CARET);
						this.state = 72;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 71;
							this.modifier();
							}
						}

						this.state = 74;
						(localctx as ArithmeticBinaryContext)._right = this.expression(10);
						}
						break;
					case 2:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 75;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 76;
						(localctx as ArithmeticBinaryContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 56) !== 0))) {
						    (localctx as ArithmeticBinaryContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 78;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 77;
							this.modifier();
							}
						}

						this.state = 80;
						(localctx as ArithmeticBinaryContext)._right = this.expression(9);
						}
						break;
					case 3:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 81;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 82;
						(localctx as ArithmeticBinaryContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===1 || _la===2)) {
						    (localctx as ArithmeticBinaryContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 84;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 83;
							this.modifier();
							}
						}

						this.state = 86;
						(localctx as ArithmeticBinaryContext)._right = this.expression(8);
						}
						break;
					case 4:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 87;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 88;
						(localctx as ArithmeticBinaryContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 8064) !== 0))) {
						    (localctx as ArithmeticBinaryContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 90;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===25) {
							{
							this.state = 89;
							this.match(promql_parser.BOOL);
							}
						}

						this.state = 93;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 92;
							this.modifier();
							}
						}

						this.state = 95;
						(localctx as ArithmeticBinaryContext)._right = this.expression(7);
						}
						break;
					case 5:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 96;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 97;
						(localctx as ArithmeticBinaryContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===16 || _la===18)) {
						    (localctx as ArithmeticBinaryContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 99;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 98;
							this.modifier();
							}
						}

						this.state = 101;
						(localctx as ArithmeticBinaryContext)._right = this.expression(6);
						}
						break;
					case 6:
						{
						localctx = new ArithmeticBinaryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as ArithmeticBinaryContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 102;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 103;
						(localctx as ArithmeticBinaryContext)._op = this.match(promql_parser.OR);
						this.state = 105;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la===21 || _la===22) {
							{
							this.state = 104;
							this.modifier();
							}
						}

						this.state = 107;
						(localctx as ArithmeticBinaryContext)._right = this.expression(5);
						}
						break;
					case 7:
						{
						localctx = new SubqueryContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, promql_parser.RULE_expression);
						this.state = 108;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 109;
						this.match(promql_parser.LSB);
						this.state = 110;
						(localctx as SubqueryContext)._range = this.duration();
						this.state = 111;
						this.subqueryResolution();
						this.state = 112;
						this.match(promql_parser.RSB);
						this.state = 114;
						this._errHandler.sync(this);
						switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
						case 1:
							{
							this.state = 113;
							this.evaluation();
							}
							break;
						}
						}
						break;
					}
					}
				}
				this.state = 120;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
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
	public subqueryResolution(): SubqueryResolutionContext {
		let localctx: SubqueryResolutionContext = new SubqueryResolutionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, promql_parser.RULE_subqueryResolution);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 121;
			this.match(promql_parser.COLON);
			this.state = 123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1142882310) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 6129) !== 0)) {
				{
				this.state = 122;
				localctx._resolution = this.duration();
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
	public value(): ValueContext {
		let localctx: ValueContext = new ValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, promql_parser.RULE_value);
		try {
			this.state = 128;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 125;
				this.function_();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 126;
				this.selector();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 127;
				this.constant();
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
	public function_(): FunctionContext {
		let localctx: FunctionContext = new FunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, promql_parser.RULE_function);
		let _la: number;
		try {
			this.state = 148;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 130;
				this.match(promql_parser.IDENTIFIER);
				this.state = 131;
				this.match(promql_parser.LP);
				this.state = 133;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1142882310) !== 0) || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & 6129) !== 0)) {
					{
					this.state = 132;
					this.functionParams();
					}
				}

				this.state = 135;
				this.match(promql_parser.RP);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 136;
				this.match(promql_parser.IDENTIFIER);
				this.state = 137;
				this.match(promql_parser.LP);
				this.state = 138;
				this.functionParams();
				this.state = 139;
				this.match(promql_parser.RP);
				this.state = 140;
				this.grouping();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 142;
				this.match(promql_parser.IDENTIFIER);
				this.state = 143;
				this.grouping();
				this.state = 144;
				this.match(promql_parser.LP);
				this.state = 145;
				this.functionParams();
				this.state = 146;
				this.match(promql_parser.RP);
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
	public functionParams(): FunctionParamsContext {
		let localctx: FunctionParamsContext = new FunctionParamsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, promql_parser.RULE_functionParams);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 150;
			this.expression(0);
			this.state = 155;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===37) {
				{
				{
				this.state = 151;
				this.match(promql_parser.COMMA);
				this.state = 152;
				this.expression(0);
				}
				}
				this.state = 157;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public grouping(): GroupingContext {
		let localctx: GroupingContext = new GroupingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, promql_parser.RULE_grouping);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 158;
			_la = this._input.LA(1);
			if(!(_la===19 || _la===20)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 159;
			this.labelList();
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
	public selector(): SelectorContext {
		let localctx: SelectorContext = new SelectorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, promql_parser.RULE_selector);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 161;
			this.seriesMatcher();
			this.state = 166;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 16, this._ctx) ) {
			case 1:
				{
				this.state = 162;
				this.match(promql_parser.LSB);
				this.state = 163;
				this.duration();
				this.state = 164;
				this.match(promql_parser.RSB);
				}
				break;
			}
			this.state = 169;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 168;
				this.evaluation();
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
	public seriesMatcher(): SeriesMatcherContext {
		let localctx: SeriesMatcherContext = new SeriesMatcherContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, promql_parser.RULE_seriesMatcher);
		let _la: number;
		try {
			this.state = 183;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 26:
			case 44:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 171;
				this.metricName();
				this.state = 177;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 19, this._ctx) ) {
				case 1:
					{
					this.state = 172;
					this.match(promql_parser.LCB);
					this.state = 174;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (((((_la - 16)) & ~0x1F) === 0 && ((1 << (_la - 16)) & 306186239) !== 0)) {
						{
						this.state = 173;
						this.labels();
						}
					}

					this.state = 176;
					this.match(promql_parser.RCB);
					}
					break;
				}
				}
				break;
			case 30:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 179;
				this.match(promql_parser.LCB);
				this.state = 180;
				this.labels();
				this.state = 181;
				this.match(promql_parser.RCB);
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
	public modifier(): ModifierContext {
		let localctx: ModifierContext = new ModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, promql_parser.RULE_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 185;
			localctx._matching = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===21 || _la===22)) {
			    localctx._matching = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 186;
			localctx._modifierLabels = this.labelList();
			this.state = 192;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===23 || _la===24) {
				{
				this.state = 187;
				localctx._joining = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===23 || _la===24)) {
				    localctx._joining = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 190;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 21, this._ctx) ) {
				case 1:
					{
					this.state = 188;
					localctx._groupLabels = this.labelList();
					}
					break;
				case 2:
					{
					this.state = 189;
					if (!(this._input.LA(1) !== promql_parser.LP)) {
						throw this.createFailedPredicateException("this._input.LA(1) !== promql_parser.LP", "Invalid label list after [" + this._input.LT(-1).text + "]");
					}
					}
					break;
				}
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
	public labelList(): LabelListContext {
		let localctx: LabelListContext = new LabelListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, promql_parser.RULE_labelList);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 194;
			this.match(promql_parser.LP);
			this.state = 206;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 16)) & ~0x1F) === 0 && ((1 << (_la - 16)) & 809502703) !== 0)) {
				{
				this.state = 195;
				this.labelListItem();
				this.state = 200;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 196;
						this.match(promql_parser.COMMA);
						this.state = 197;
						this.labelListItem();
						}
						}
					}
					this.state = 202;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
				}
				this.state = 204;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===37) {
					{
					this.state = 203;
					this.match(promql_parser.COMMA);
					}
				}

				}
			}

			this.state = 208;
			this.match(promql_parser.RP);
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
	public labelListItem(): LabelListItemContext {
		let localctx: LabelListItemContext = new LabelListItemContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, promql_parser.RULE_labelListItem);
		try {
			this.state = 213;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 16:
			case 17:
			case 18:
			case 19:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
			case 44:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 210;
				this.groupingLabel();
				}
				break;
			case 38:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 211;
				this.match(promql_parser.STRING);
				}
				break;
			case 45:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 212;
				this.match(promql_parser.NAMED_OR_POSITIONAL_DOUBLE_PARAMS);
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
	public labels(): LabelsContext {
		let localctx: LabelsContext = new LabelsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, promql_parser.RULE_labels);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 215;
			this.label();
			this.state = 220;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 27, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 216;
					this.match(promql_parser.COMMA);
					this.state = 217;
					this.label();
					}
					}
				}
				this.state = 222;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 27, this._ctx);
			}
			this.state = 224;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===37) {
				{
				this.state = 223;
				this.match(promql_parser.COMMA);
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
	public label(): LabelContext {
		let localctx: LabelContext = new LabelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, promql_parser.RULE_label);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 226;
			this.labelName();
			this.state = 229;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 57600) !== 0)) {
				{
				this.state = 227;
				localctx._kind = this._input.LT(1);
				_la = this._input.LA(1);
				if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 57600) !== 0))) {
				    localctx._kind = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 228;
				this.labelValue();
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
	public labelValue(): LabelValueContext {
		let localctx: LabelValueContext = new LabelValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, promql_parser.RULE_labelValue);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 231;
			_la = this._input.LA(1);
			if(!(_la===38 || _la===46)) {
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
	public labelName(): LabelNameContext {
		let localctx: LabelNameContext = new LabelNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, promql_parser.RULE_labelName);
		try {
			this.state = 236;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
			case 44:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 233;
				this.identifier();
				}
				break;
			case 38:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 234;
				this.match(promql_parser.STRING);
				}
				break;
			case 41:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 235;
				this.match(promql_parser.INF_OR_NAN);
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
	public identifier(): IdentifierContext {
		let localctx: IdentifierContext = new IdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, promql_parser.RULE_identifier);
		try {
			this.state = 240;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 44:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 238;
				this.match(promql_parser.IDENTIFIER);
				}
				break;
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 239;
				this.nonReserved();
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
	public metricName(): MetricNameContext {
		let localctx: MetricNameContext = new MetricNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, promql_parser.RULE_metricName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 242;
			_la = this._input.LA(1);
			if(!(((((_la - 16)) & ~0x1F) === 0 && ((1 << (_la - 16)) & 268436511) !== 0))) {
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
	public groupingLabel(): GroupingLabelContext {
		let localctx: GroupingLabelContext = new GroupingLabelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, promql_parser.RULE_groupingLabel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 244;
			_la = this._input.LA(1);
			if(!(((((_la - 16)) & ~0x1F) === 0 && ((1 << (_la - 16)) & 268437487) !== 0))) {
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
	public evaluation(): EvaluationContext {
		let localctx: EvaluationContext = new EvaluationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, promql_parser.RULE_evaluation);
		try {
			this.state = 254;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 26:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 246;
				this.offset();
				this.state = 248;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 32, this._ctx) ) {
				case 1:
					{
					this.state = 247;
					this.at();
					}
					break;
				}
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 250;
				this.at();
				this.state = 252;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 33, this._ctx) ) {
				case 1:
					{
					this.state = 251;
					this.offset();
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
	public offset(): OffsetContext {
		let localctx: OffsetContext = new OffsetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, promql_parser.RULE_offset);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 256;
			this.match(promql_parser.OFFSET);
			this.state = 258;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1 || _la===2) {
				{
				this.state = 257;
				_la = this._input.LA(1);
				if(!(_la===1 || _la===2)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 265;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 46:
				{
				this.state = 260;
				this.timeValue();
				}
				break;
			case 34:
				{
				this.state = 261;
				this.match(promql_parser.LP);
				this.state = 262;
				this.duration();
				this.state = 263;
				this.match(promql_parser.RP);
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
	public duration(): DurationContext {
		let localctx: DurationContext = new DurationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, promql_parser.RULE_duration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 267;
			this.expression(0);
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
	public at(): AtContext {
		let localctx: AtContext = new AtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, promql_parser.RULE_at);
		let _la: number;
		try {
			this.state = 276;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 269;
				this.match(promql_parser.AT);
				this.state = 271;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===1 || _la===2) {
					{
					this.state = 270;
					_la = this._input.LA(1);
					if(!(_la===1 || _la===2)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 273;
				this.timeValue();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 274;
				this.match(promql_parser.AT);
				this.state = 275;
				_la = this._input.LA(1);
				if(!(_la===28 || _la===29)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
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
	public constant(): ConstantContext {
		let localctx: ConstantContext = new ConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, promql_parser.RULE_constant);
		try {
			this.state = 281;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 278;
				this.number_();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 279;
				this.string_();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 280;
				this.timeValue();
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
	public number_(): NumberContext {
		let localctx: NumberContext = new NumberContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, promql_parser.RULE_number);
		let _la: number;
		try {
			this.state = 286;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 40:
			case 41:
				localctx = new DecimalLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 283;
				_la = this._input.LA(1);
				if(!(_la===40 || _la===41)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 39:
				localctx = new IntegerLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 284;
				this.match(promql_parser.INTEGER_VALUE);
				}
				break;
			case 42:
				localctx = new HexLiteralContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 285;
				this.match(promql_parser.HEXADECIMAL);
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
	public string_(): StringContext {
		let localctx: StringContext = new StringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, promql_parser.RULE_string);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 288;
			this.match(promql_parser.STRING);
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
	public timeValue(): TimeValueContext {
		let localctx: TimeValueContext = new TimeValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, promql_parser.RULE_timeValue);
		try {
			this.state = 293;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 43:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 290;
				this.match(promql_parser.TIME_VALUE);
				}
				break;
			case 39:
			case 40:
			case 41:
			case 42:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 291;
				this.number_();
				}
				break;
			case 46:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 292;
				this.match(promql_parser.NAMED_OR_POSITIONAL_PARAM);
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
	public nonReserved(): NonReservedContext {
		let localctx: NonReservedContext = new NonReservedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, promql_parser.RULE_nonReserved);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 295;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 134152192) !== 0))) {
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
		case 1:
			return this.expression_sempred(localctx as ExpressionContext, predIndex);
		case 9:
			return this.modifier_sempred(localctx as ModifierContext, predIndex);
		}
		return true;
	}
	private expression_sempred(localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 10);
		case 1:
			return this.precpred(this._ctx, 8);
		case 2:
			return this.precpred(this._ctx, 7);
		case 3:
			return this.precpred(this._ctx, 6);
		case 4:
			return this.precpred(this._ctx, 5);
		case 5:
			return this.precpred(this._ctx, 4);
		case 6:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private modifier_sempred(localctx: ModifierContext, predIndex: number): boolean {
		switch (predIndex) {
		case 7:
			return this._input.LA(1) !== promql_parser.LP;
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,49,298,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,
	7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,
	24,2,25,7,25,2,26,7,26,2,27,7,27,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,3,1,68,8,1,1,1,1,1,1,1,3,1,73,8,1,1,1,1,1,1,1,1,1,3,1,79,8,1,1,1,
	1,1,1,1,1,1,3,1,85,8,1,1,1,1,1,1,1,1,1,3,1,91,8,1,1,1,3,1,94,8,1,1,1,1,
	1,1,1,1,1,3,1,100,8,1,1,1,1,1,1,1,1,1,3,1,106,8,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,3,1,115,8,1,5,1,117,8,1,10,1,12,1,120,9,1,1,2,1,2,3,2,124,8,2,1,3,
	1,3,1,3,3,3,129,8,3,1,4,1,4,1,4,3,4,134,8,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,
	1,4,1,4,1,4,1,4,1,4,1,4,3,4,149,8,4,1,5,1,5,1,5,5,5,154,8,5,10,5,12,5,157,
	9,5,1,6,1,6,1,6,1,7,1,7,1,7,1,7,1,7,3,7,167,8,7,1,7,3,7,170,8,7,1,8,1,8,
	1,8,3,8,175,8,8,1,8,3,8,178,8,8,1,8,1,8,1,8,1,8,3,8,184,8,8,1,9,1,9,1,9,
	1,9,1,9,3,9,191,8,9,3,9,193,8,9,1,10,1,10,1,10,1,10,5,10,199,8,10,10,10,
	12,10,202,9,10,1,10,3,10,205,8,10,3,10,207,8,10,1,10,1,10,1,11,1,11,1,11,
	3,11,214,8,11,1,12,1,12,1,12,5,12,219,8,12,10,12,12,12,222,9,12,1,12,3,
	12,225,8,12,1,13,1,13,1,13,3,13,230,8,13,1,14,1,14,1,15,1,15,1,15,3,15,
	237,8,15,1,16,1,16,3,16,241,8,16,1,17,1,17,1,18,1,18,1,19,1,19,3,19,249,
	8,19,1,19,1,19,3,19,253,8,19,3,19,255,8,19,1,20,1,20,3,20,259,8,20,1,20,
	1,20,1,20,1,20,1,20,3,20,266,8,20,1,21,1,21,1,22,1,22,3,22,272,8,22,1,22,
	1,22,1,22,3,22,277,8,22,1,23,1,23,1,23,3,23,282,8,23,1,24,1,24,1,24,3,24,
	287,8,24,1,25,1,25,1,26,1,26,1,26,3,26,294,8,26,1,27,1,27,1,27,0,1,2,28,
	0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,
	52,54,0,14,1,0,1,2,1,0,3,5,1,0,7,12,2,0,16,16,18,18,1,0,19,20,1,0,21,22,
	1,0,23,24,2,0,8,8,13,15,2,0,38,38,46,46,3,0,16,20,26,26,44,44,3,0,16,19,
	21,26,44,44,1,0,28,29,1,0,40,41,1,0,16,26,324,0,56,1,0,0,0,2,67,1,0,0,0,
	4,121,1,0,0,0,6,128,1,0,0,0,8,148,1,0,0,0,10,150,1,0,0,0,12,158,1,0,0,0,
	14,161,1,0,0,0,16,183,1,0,0,0,18,185,1,0,0,0,20,194,1,0,0,0,22,213,1,0,
	0,0,24,215,1,0,0,0,26,226,1,0,0,0,28,231,1,0,0,0,30,236,1,0,0,0,32,240,
	1,0,0,0,34,242,1,0,0,0,36,244,1,0,0,0,38,254,1,0,0,0,40,256,1,0,0,0,42,
	267,1,0,0,0,44,276,1,0,0,0,46,281,1,0,0,0,48,286,1,0,0,0,50,288,1,0,0,0,
	52,293,1,0,0,0,54,295,1,0,0,0,56,57,3,2,1,0,57,58,5,0,0,1,58,1,1,0,0,0,
	59,60,6,1,-1,0,60,61,7,0,0,0,61,68,3,2,1,9,62,68,3,6,3,0,63,64,5,34,0,0,
	64,65,3,2,1,0,65,66,5,35,0,0,66,68,1,0,0,0,67,59,1,0,0,0,67,62,1,0,0,0,
	67,63,1,0,0,0,68,118,1,0,0,0,69,70,10,10,0,0,70,72,5,6,0,0,71,73,3,18,9,
	0,72,71,1,0,0,0,72,73,1,0,0,0,73,74,1,0,0,0,74,117,3,2,1,10,75,76,10,8,
	0,0,76,78,7,1,0,0,77,79,3,18,9,0,78,77,1,0,0,0,78,79,1,0,0,0,79,80,1,0,
	0,0,80,117,3,2,1,9,81,82,10,7,0,0,82,84,7,0,0,0,83,85,3,18,9,0,84,83,1,
	0,0,0,84,85,1,0,0,0,85,86,1,0,0,0,86,117,3,2,1,8,87,88,10,6,0,0,88,90,7,
	2,0,0,89,91,5,25,0,0,90,89,1,0,0,0,90,91,1,0,0,0,91,93,1,0,0,0,92,94,3,
	18,9,0,93,92,1,0,0,0,93,94,1,0,0,0,94,95,1,0,0,0,95,117,3,2,1,7,96,97,10,
	5,0,0,97,99,7,3,0,0,98,100,3,18,9,0,99,98,1,0,0,0,99,100,1,0,0,0,100,101,
	1,0,0,0,101,117,3,2,1,6,102,103,10,4,0,0,103,105,5,17,0,0,104,106,3,18,
	9,0,105,104,1,0,0,0,105,106,1,0,0,0,106,107,1,0,0,0,107,117,3,2,1,5,108,
	109,10,1,0,0,109,110,5,32,0,0,110,111,3,42,21,0,111,112,3,4,2,0,112,114,
	5,33,0,0,113,115,3,38,19,0,114,113,1,0,0,0,114,115,1,0,0,0,115,117,1,0,
	0,0,116,69,1,0,0,0,116,75,1,0,0,0,116,81,1,0,0,0,116,87,1,0,0,0,116,96,
	1,0,0,0,116,102,1,0,0,0,116,108,1,0,0,0,117,120,1,0,0,0,118,116,1,0,0,0,
	118,119,1,0,0,0,119,3,1,0,0,0,120,118,1,0,0,0,121,123,5,36,0,0,122,124,
	3,42,21,0,123,122,1,0,0,0,123,124,1,0,0,0,124,5,1,0,0,0,125,129,3,8,4,0,
	126,129,3,14,7,0,127,129,3,46,23,0,128,125,1,0,0,0,128,126,1,0,0,0,128,
	127,1,0,0,0,129,7,1,0,0,0,130,131,5,44,0,0,131,133,5,34,0,0,132,134,3,10,
	5,0,133,132,1,0,0,0,133,134,1,0,0,0,134,135,1,0,0,0,135,149,5,35,0,0,136,
	137,5,44,0,0,137,138,5,34,0,0,138,139,3,10,5,0,139,140,5,35,0,0,140,141,
	3,12,6,0,141,149,1,0,0,0,142,143,5,44,0,0,143,144,3,12,6,0,144,145,5,34,
	0,0,145,146,3,10,5,0,146,147,5,35,0,0,147,149,1,0,0,0,148,130,1,0,0,0,148,
	136,1,0,0,0,148,142,1,0,0,0,149,9,1,0,0,0,150,155,3,2,1,0,151,152,5,37,
	0,0,152,154,3,2,1,0,153,151,1,0,0,0,154,157,1,0,0,0,155,153,1,0,0,0,155,
	156,1,0,0,0,156,11,1,0,0,0,157,155,1,0,0,0,158,159,7,4,0,0,159,160,3,20,
	10,0,160,13,1,0,0,0,161,166,3,16,8,0,162,163,5,32,0,0,163,164,3,42,21,0,
	164,165,5,33,0,0,165,167,1,0,0,0,166,162,1,0,0,0,166,167,1,0,0,0,167,169,
	1,0,0,0,168,170,3,38,19,0,169,168,1,0,0,0,169,170,1,0,0,0,170,15,1,0,0,
	0,171,177,3,34,17,0,172,174,5,30,0,0,173,175,3,24,12,0,174,173,1,0,0,0,
	174,175,1,0,0,0,175,176,1,0,0,0,176,178,5,31,0,0,177,172,1,0,0,0,177,178,
	1,0,0,0,178,184,1,0,0,0,179,180,5,30,0,0,180,181,3,24,12,0,181,182,5,31,
	0,0,182,184,1,0,0,0,183,171,1,0,0,0,183,179,1,0,0,0,184,17,1,0,0,0,185,
	186,7,5,0,0,186,192,3,20,10,0,187,190,7,6,0,0,188,191,3,20,10,0,189,191,
	4,9,7,0,190,188,1,0,0,0,190,189,1,0,0,0,191,193,1,0,0,0,192,187,1,0,0,0,
	192,193,1,0,0,0,193,19,1,0,0,0,194,206,5,34,0,0,195,200,3,22,11,0,196,197,
	5,37,0,0,197,199,3,22,11,0,198,196,1,0,0,0,199,202,1,0,0,0,200,198,1,0,
	0,0,200,201,1,0,0,0,201,204,1,0,0,0,202,200,1,0,0,0,203,205,5,37,0,0,204,
	203,1,0,0,0,204,205,1,0,0,0,205,207,1,0,0,0,206,195,1,0,0,0,206,207,1,0,
	0,0,207,208,1,0,0,0,208,209,5,35,0,0,209,21,1,0,0,0,210,214,3,36,18,0,211,
	214,5,38,0,0,212,214,5,45,0,0,213,210,1,0,0,0,213,211,1,0,0,0,213,212,1,
	0,0,0,214,23,1,0,0,0,215,220,3,26,13,0,216,217,5,37,0,0,217,219,3,26,13,
	0,218,216,1,0,0,0,219,222,1,0,0,0,220,218,1,0,0,0,220,221,1,0,0,0,221,224,
	1,0,0,0,222,220,1,0,0,0,223,225,5,37,0,0,224,223,1,0,0,0,224,225,1,0,0,
	0,225,25,1,0,0,0,226,229,3,30,15,0,227,228,7,7,0,0,228,230,3,28,14,0,229,
	227,1,0,0,0,229,230,1,0,0,0,230,27,1,0,0,0,231,232,7,8,0,0,232,29,1,0,0,
	0,233,237,3,32,16,0,234,237,5,38,0,0,235,237,5,41,0,0,236,233,1,0,0,0,236,
	234,1,0,0,0,236,235,1,0,0,0,237,31,1,0,0,0,238,241,5,44,0,0,239,241,3,54,
	27,0,240,238,1,0,0,0,240,239,1,0,0,0,241,33,1,0,0,0,242,243,7,9,0,0,243,
	35,1,0,0,0,244,245,7,10,0,0,245,37,1,0,0,0,246,248,3,40,20,0,247,249,3,
	44,22,0,248,247,1,0,0,0,248,249,1,0,0,0,249,255,1,0,0,0,250,252,3,44,22,
	0,251,253,3,40,20,0,252,251,1,0,0,0,252,253,1,0,0,0,253,255,1,0,0,0,254,
	246,1,0,0,0,254,250,1,0,0,0,255,39,1,0,0,0,256,258,5,26,0,0,257,259,7,0,
	0,0,258,257,1,0,0,0,258,259,1,0,0,0,259,265,1,0,0,0,260,266,3,52,26,0,261,
	262,5,34,0,0,262,263,3,42,21,0,263,264,5,35,0,0,264,266,1,0,0,0,265,260,
	1,0,0,0,265,261,1,0,0,0,266,41,1,0,0,0,267,268,3,2,1,0,268,43,1,0,0,0,269,
	271,5,27,0,0,270,272,7,0,0,0,271,270,1,0,0,0,271,272,1,0,0,0,272,273,1,
	0,0,0,273,277,3,52,26,0,274,275,5,27,0,0,275,277,7,11,0,0,276,269,1,0,0,
	0,276,274,1,0,0,0,277,45,1,0,0,0,278,282,3,48,24,0,279,282,3,50,25,0,280,
	282,3,52,26,0,281,278,1,0,0,0,281,279,1,0,0,0,281,280,1,0,0,0,282,47,1,
	0,0,0,283,287,7,12,0,0,284,287,5,39,0,0,285,287,5,42,0,0,286,283,1,0,0,
	0,286,284,1,0,0,0,286,285,1,0,0,0,287,49,1,0,0,0,288,289,5,38,0,0,289,51,
	1,0,0,0,290,294,5,43,0,0,291,294,3,48,24,0,292,294,5,46,0,0,293,290,1,0,
	0,0,293,291,1,0,0,0,293,292,1,0,0,0,294,53,1,0,0,0,295,296,7,13,0,0,296,
	55,1,0,0,0,42,67,72,78,84,90,93,99,105,114,116,118,123,128,133,148,155,
	166,169,174,177,183,190,192,200,204,206,213,220,224,229,236,240,248,252,
	254,258,265,271,276,281,286,293];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!promql_parser.__ATN) {
			promql_parser.__ATN = new ATNDeserializer().deserialize(promql_parser._serializedATN);
		}

		return promql_parser.__ATN;
	}


	static DecisionsToDFA = promql_parser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class SingleStatementContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(promql_parser.EOF, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_singleStatement;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterSingleStatement) {
	 		listener.enterSingleStatement(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitSingleStatement) {
	 		listener.exitSingleStatement(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_expression;
	}
	public override copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class ValueExpressionContext extends ExpressionContext {
	constructor(parser: promql_parser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public value(): ValueContext {
		return this.getTypedRuleContext(ValueContext, 0) as ValueContext;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterValueExpression) {
	 		listener.enterValueExpression(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitValueExpression) {
	 		listener.exitValueExpression(this);
		}
	}
}
export class SubqueryContext extends ExpressionContext {
	public _range!: DurationContext;
	constructor(parser: promql_parser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public LSB(): TerminalNode {
		return this.getToken(promql_parser.LSB, 0);
	}
	public subqueryResolution(): SubqueryResolutionContext {
		return this.getTypedRuleContext(SubqueryResolutionContext, 0) as SubqueryResolutionContext;
	}
	public RSB(): TerminalNode {
		return this.getToken(promql_parser.RSB, 0);
	}
	public duration(): DurationContext {
		return this.getTypedRuleContext(DurationContext, 0) as DurationContext;
	}
	public evaluation(): EvaluationContext {
		return this.getTypedRuleContext(EvaluationContext, 0) as EvaluationContext;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterSubquery) {
	 		listener.enterSubquery(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitSubquery) {
	 		listener.exitSubquery(this);
		}
	}
}
export class ParenthesizedContext extends ExpressionContext {
	constructor(parser: promql_parser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(promql_parser.LP, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RP(): TerminalNode {
		return this.getToken(promql_parser.RP, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterParenthesized) {
	 		listener.enterParenthesized(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitParenthesized) {
	 		listener.exitParenthesized(this);
		}
	}
}
export class ArithmeticBinaryContext extends ExpressionContext {
	public _left!: ExpressionContext;
	public _op!: Token;
	public _right!: ExpressionContext;
	constructor(parser: promql_parser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public CARET(): TerminalNode {
		return this.getToken(promql_parser.CARET, 0);
	}
	public modifier(): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, 0) as ModifierContext;
	}
	public ASTERISK(): TerminalNode {
		return this.getToken(promql_parser.ASTERISK, 0);
	}
	public PERCENT(): TerminalNode {
		return this.getToken(promql_parser.PERCENT, 0);
	}
	public SLASH(): TerminalNode {
		return this.getToken(promql_parser.SLASH, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(promql_parser.MINUS, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(promql_parser.PLUS, 0);
	}
	public EQ(): TerminalNode {
		return this.getToken(promql_parser.EQ, 0);
	}
	public NEQ(): TerminalNode {
		return this.getToken(promql_parser.NEQ, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(promql_parser.GT, 0);
	}
	public GTE(): TerminalNode {
		return this.getToken(promql_parser.GTE, 0);
	}
	public LT(): TerminalNode {
		return this.getToken(promql_parser.LT, 0);
	}
	public LTE(): TerminalNode {
		return this.getToken(promql_parser.LTE, 0);
	}
	public BOOL(): TerminalNode {
		return this.getToken(promql_parser.BOOL, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(promql_parser.AND, 0);
	}
	public UNLESS(): TerminalNode {
		return this.getToken(promql_parser.UNLESS, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(promql_parser.OR, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterArithmeticBinary) {
	 		listener.enterArithmeticBinary(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitArithmeticBinary) {
	 		listener.exitArithmeticBinary(this);
		}
	}
}
export class ArithmeticUnaryContext extends ExpressionContext {
	public _operator!: Token;
	constructor(parser: promql_parser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public PLUS(): TerminalNode {
		return this.getToken(promql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(promql_parser.MINUS, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterArithmeticUnary) {
	 		listener.enterArithmeticUnary(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitArithmeticUnary) {
	 		listener.exitArithmeticUnary(this);
		}
	}
}


export class SubqueryResolutionContext extends ParserRuleContext {
	public _resolution!: DurationContext;
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLON(): TerminalNode {
		return this.getToken(promql_parser.COLON, 0);
	}
	public duration(): DurationContext {
		return this.getTypedRuleContext(DurationContext, 0) as DurationContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_subqueryResolution;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterSubqueryResolution) {
	 		listener.enterSubqueryResolution(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitSubqueryResolution) {
	 		listener.exitSubqueryResolution(this);
		}
	}
}


export class ValueContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public function_(): FunctionContext {
		return this.getTypedRuleContext(FunctionContext, 0) as FunctionContext;
	}
	public selector(): SelectorContext {
		return this.getTypedRuleContext(SelectorContext, 0) as SelectorContext;
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_value;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterValue) {
	 		listener.enterValue(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitValue) {
	 		listener.exitValue(this);
		}
	}
}


export class FunctionContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(promql_parser.IDENTIFIER, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(promql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(promql_parser.RP, 0);
	}
	public functionParams(): FunctionParamsContext {
		return this.getTypedRuleContext(FunctionParamsContext, 0) as FunctionParamsContext;
	}
	public grouping(): GroupingContext {
		return this.getTypedRuleContext(GroupingContext, 0) as GroupingContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_function;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterFunction) {
	 		listener.enterFunction(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitFunction) {
	 		listener.exitFunction(this);
		}
	}
}


export class FunctionParamsContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(promql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(promql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_functionParams;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterFunctionParams) {
	 		listener.enterFunctionParams(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitFunctionParams) {
	 		listener.exitFunctionParams(this);
		}
	}
}


export class GroupingContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public labelList(): LabelListContext {
		return this.getTypedRuleContext(LabelListContext, 0) as LabelListContext;
	}
	public BY(): TerminalNode {
		return this.getToken(promql_parser.BY, 0);
	}
	public WITHOUT(): TerminalNode {
		return this.getToken(promql_parser.WITHOUT, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_grouping;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterGrouping) {
	 		listener.enterGrouping(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitGrouping) {
	 		listener.exitGrouping(this);
		}
	}
}


export class SelectorContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public seriesMatcher(): SeriesMatcherContext {
		return this.getTypedRuleContext(SeriesMatcherContext, 0) as SeriesMatcherContext;
	}
	public LSB(): TerminalNode {
		return this.getToken(promql_parser.LSB, 0);
	}
	public duration(): DurationContext {
		return this.getTypedRuleContext(DurationContext, 0) as DurationContext;
	}
	public RSB(): TerminalNode {
		return this.getToken(promql_parser.RSB, 0);
	}
	public evaluation(): EvaluationContext {
		return this.getTypedRuleContext(EvaluationContext, 0) as EvaluationContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_selector;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterSelector) {
	 		listener.enterSelector(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitSelector) {
	 		listener.exitSelector(this);
		}
	}
}


export class SeriesMatcherContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public metricName(): MetricNameContext {
		return this.getTypedRuleContext(MetricNameContext, 0) as MetricNameContext;
	}
	public LCB(): TerminalNode {
		return this.getToken(promql_parser.LCB, 0);
	}
	public RCB(): TerminalNode {
		return this.getToken(promql_parser.RCB, 0);
	}
	public labels(): LabelsContext {
		return this.getTypedRuleContext(LabelsContext, 0) as LabelsContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_seriesMatcher;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterSeriesMatcher) {
	 		listener.enterSeriesMatcher(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitSeriesMatcher) {
	 		listener.exitSeriesMatcher(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	public _matching!: Token;
	public _modifierLabels!: LabelListContext;
	public _joining!: Token;
	public _groupLabels!: LabelListContext;
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public labelList_list(): LabelListContext[] {
		return this.getTypedRuleContexts(LabelListContext) as LabelListContext[];
	}
	public labelList(i: number): LabelListContext {
		return this.getTypedRuleContext(LabelListContext, i) as LabelListContext;
	}
	public IGNORING(): TerminalNode {
		return this.getToken(promql_parser.IGNORING, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(promql_parser.ON, 0);
	}
	public GROUP_LEFT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_LEFT, 0);
	}
	public GROUP_RIGHT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_RIGHT, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_modifier;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterModifier) {
	 		listener.enterModifier(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitModifier) {
	 		listener.exitModifier(this);
		}
	}
}


export class LabelListContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(promql_parser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(promql_parser.RP, 0);
	}
	public labelListItem_list(): LabelListItemContext[] {
		return this.getTypedRuleContexts(LabelListItemContext) as LabelListItemContext[];
	}
	public labelListItem(i: number): LabelListItemContext {
		return this.getTypedRuleContext(LabelListItemContext, i) as LabelListItemContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(promql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(promql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_labelList;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabelList) {
	 		listener.enterLabelList(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabelList) {
	 		listener.exitLabelList(this);
		}
	}
}


export class LabelListItemContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public groupingLabel(): GroupingLabelContext {
		return this.getTypedRuleContext(GroupingLabelContext, 0) as GroupingLabelContext;
	}
	public STRING(): TerminalNode {
		return this.getToken(promql_parser.STRING, 0);
	}
	public NAMED_OR_POSITIONAL_DOUBLE_PARAMS(): TerminalNode {
		return this.getToken(promql_parser.NAMED_OR_POSITIONAL_DOUBLE_PARAMS, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_labelListItem;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabelListItem) {
	 		listener.enterLabelListItem(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabelListItem) {
	 		listener.exitLabelListItem(this);
		}
	}
}


export class LabelsContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public label_list(): LabelContext[] {
		return this.getTypedRuleContexts(LabelContext) as LabelContext[];
	}
	public label(i: number): LabelContext {
		return this.getTypedRuleContext(LabelContext, i) as LabelContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(promql_parser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(promql_parser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_labels;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabels) {
	 		listener.enterLabels(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabels) {
	 		listener.exitLabels(this);
		}
	}
}


export class LabelContext extends ParserRuleContext {
	public _kind!: Token;
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public labelName(): LabelNameContext {
		return this.getTypedRuleContext(LabelNameContext, 0) as LabelNameContext;
	}
	public labelValue(): LabelValueContext {
		return this.getTypedRuleContext(LabelValueContext, 0) as LabelValueContext;
	}
	public LABEL_EQ(): TerminalNode {
		return this.getToken(promql_parser.LABEL_EQ, 0);
	}
	public NEQ(): TerminalNode {
		return this.getToken(promql_parser.NEQ, 0);
	}
	public LABEL_RGX(): TerminalNode {
		return this.getToken(promql_parser.LABEL_RGX, 0);
	}
	public LABEL_RGX_NEQ(): TerminalNode {
		return this.getToken(promql_parser.LABEL_RGX_NEQ, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_label;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabel) {
	 		listener.enterLabel(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabel) {
	 		listener.exitLabel(this);
		}
	}
}


export class LabelValueContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING(): TerminalNode {
		return this.getToken(promql_parser.STRING, 0);
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(promql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_labelValue;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabelValue) {
	 		listener.enterLabelValue(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabelValue) {
	 		listener.exitLabelValue(this);
		}
	}
}


export class LabelNameContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public STRING(): TerminalNode {
		return this.getToken(promql_parser.STRING, 0);
	}
	public INF_OR_NAN(): TerminalNode {
		return this.getToken(promql_parser.INF_OR_NAN, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_labelName;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterLabelName) {
	 		listener.enterLabelName(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitLabelName) {
	 		listener.exitLabelName(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(promql_parser.IDENTIFIER, 0);
	}
	public nonReserved(): NonReservedContext {
		return this.getTypedRuleContext(NonReservedContext, 0) as NonReservedContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_identifier;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterIdentifier) {
	 		listener.enterIdentifier(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitIdentifier) {
	 		listener.exitIdentifier(this);
		}
	}
}


export class MetricNameContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(promql_parser.IDENTIFIER, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(promql_parser.AND, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(promql_parser.BY, 0);
	}
	public OFFSET(): TerminalNode {
		return this.getToken(promql_parser.OFFSET, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(promql_parser.OR, 0);
	}
	public UNLESS(): TerminalNode {
		return this.getToken(promql_parser.UNLESS, 0);
	}
	public WITHOUT(): TerminalNode {
		return this.getToken(promql_parser.WITHOUT, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_metricName;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterMetricName) {
	 		listener.enterMetricName(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitMetricName) {
	 		listener.exitMetricName(this);
		}
	}
}


export class GroupingLabelContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(promql_parser.IDENTIFIER, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(promql_parser.AND, 0);
	}
	public BOOL(): TerminalNode {
		return this.getToken(promql_parser.BOOL, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(promql_parser.BY, 0);
	}
	public GROUP_LEFT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_LEFT, 0);
	}
	public GROUP_RIGHT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_RIGHT, 0);
	}
	public IGNORING(): TerminalNode {
		return this.getToken(promql_parser.IGNORING, 0);
	}
	public OFFSET(): TerminalNode {
		return this.getToken(promql_parser.OFFSET, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(promql_parser.ON, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(promql_parser.OR, 0);
	}
	public UNLESS(): TerminalNode {
		return this.getToken(promql_parser.UNLESS, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_groupingLabel;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterGroupingLabel) {
	 		listener.enterGroupingLabel(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitGroupingLabel) {
	 		listener.exitGroupingLabel(this);
		}
	}
}


export class EvaluationContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public offset(): OffsetContext {
		return this.getTypedRuleContext(OffsetContext, 0) as OffsetContext;
	}
	public at(): AtContext {
		return this.getTypedRuleContext(AtContext, 0) as AtContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_evaluation;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterEvaluation) {
	 		listener.enterEvaluation(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitEvaluation) {
	 		listener.exitEvaluation(this);
		}
	}
}


export class OffsetContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OFFSET(): TerminalNode {
		return this.getToken(promql_parser.OFFSET, 0);
	}
	public timeValue(): TimeValueContext {
		return this.getTypedRuleContext(TimeValueContext, 0) as TimeValueContext;
	}
	public LP(): TerminalNode {
		return this.getToken(promql_parser.LP, 0);
	}
	public duration(): DurationContext {
		return this.getTypedRuleContext(DurationContext, 0) as DurationContext;
	}
	public RP(): TerminalNode {
		return this.getToken(promql_parser.RP, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(promql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(promql_parser.MINUS, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_offset;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterOffset) {
	 		listener.enterOffset(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitOffset) {
	 		listener.exitOffset(this);
		}
	}
}


export class DurationContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_duration;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterDuration) {
	 		listener.enterDuration(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitDuration) {
	 		listener.exitDuration(this);
		}
	}
}


export class AtContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AT(): TerminalNode {
		return this.getToken(promql_parser.AT, 0);
	}
	public timeValue(): TimeValueContext {
		return this.getTypedRuleContext(TimeValueContext, 0) as TimeValueContext;
	}
	public PLUS(): TerminalNode {
		return this.getToken(promql_parser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(promql_parser.MINUS, 0);
	}
	public AT_START(): TerminalNode {
		return this.getToken(promql_parser.AT_START, 0);
	}
	public AT_END(): TerminalNode {
		return this.getToken(promql_parser.AT_END, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_at;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterAt) {
	 		listener.enterAt(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitAt) {
	 		listener.exitAt(this);
		}
	}
}


export class ConstantContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public number_(): NumberContext {
		return this.getTypedRuleContext(NumberContext, 0) as NumberContext;
	}
	public string_(): StringContext {
		return this.getTypedRuleContext(StringContext, 0) as StringContext;
	}
	public timeValue(): TimeValueContext {
		return this.getTypedRuleContext(TimeValueContext, 0) as TimeValueContext;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_constant;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterConstant) {
	 		listener.enterConstant(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitConstant) {
	 		listener.exitConstant(this);
		}
	}
}


export class NumberContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_number;
	}
	public override copyFrom(ctx: NumberContext): void {
		super.copyFrom(ctx);
	}
}
export class DecimalLiteralContext extends NumberContext {
	constructor(parser: promql_parser, ctx: NumberContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DECIMAL_VALUE(): TerminalNode {
		return this.getToken(promql_parser.DECIMAL_VALUE, 0);
	}
	public INF_OR_NAN(): TerminalNode {
		return this.getToken(promql_parser.INF_OR_NAN, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterDecimalLiteral) {
	 		listener.enterDecimalLiteral(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitDecimalLiteral) {
	 		listener.exitDecimalLiteral(this);
		}
	}
}
export class IntegerLiteralContext extends NumberContext {
	constructor(parser: promql_parser, ctx: NumberContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public INTEGER_VALUE(): TerminalNode {
		return this.getToken(promql_parser.INTEGER_VALUE, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterIntegerLiteral) {
	 		listener.enterIntegerLiteral(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitIntegerLiteral) {
	 		listener.exitIntegerLiteral(this);
		}
	}
}
export class HexLiteralContext extends NumberContext {
	constructor(parser: promql_parser, ctx: NumberContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HEXADECIMAL(): TerminalNode {
		return this.getToken(promql_parser.HEXADECIMAL, 0);
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterHexLiteral) {
	 		listener.enterHexLiteral(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitHexLiteral) {
	 		listener.exitHexLiteral(this);
		}
	}
}


export class StringContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING(): TerminalNode {
		return this.getToken(promql_parser.STRING, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_string;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterString) {
	 		listener.enterString(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitString) {
	 		listener.exitString(this);
		}
	}
}


export class TimeValueContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TIME_VALUE(): TerminalNode {
		return this.getToken(promql_parser.TIME_VALUE, 0);
	}
	public number_(): NumberContext {
		return this.getTypedRuleContext(NumberContext, 0) as NumberContext;
	}
	public NAMED_OR_POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(promql_parser.NAMED_OR_POSITIONAL_PARAM, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_timeValue;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterTimeValue) {
	 		listener.enterTimeValue(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitTimeValue) {
	 		listener.exitTimeValue(this);
		}
	}
}


export class NonReservedContext extends ParserRuleContext {
	constructor(parser?: promql_parser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AND(): TerminalNode {
		return this.getToken(promql_parser.AND, 0);
	}
	public BOOL(): TerminalNode {
		return this.getToken(promql_parser.BOOL, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(promql_parser.BY, 0);
	}
	public GROUP_LEFT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_LEFT, 0);
	}
	public GROUP_RIGHT(): TerminalNode {
		return this.getToken(promql_parser.GROUP_RIGHT, 0);
	}
	public IGNORING(): TerminalNode {
		return this.getToken(promql_parser.IGNORING, 0);
	}
	public OFFSET(): TerminalNode {
		return this.getToken(promql_parser.OFFSET, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(promql_parser.OR, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(promql_parser.ON, 0);
	}
	public UNLESS(): TerminalNode {
		return this.getToken(promql_parser.UNLESS, 0);
	}
	public WITHOUT(): TerminalNode {
		return this.getToken(promql_parser.WITHOUT, 0);
	}
    public get ruleIndex(): number {
    	return promql_parser.RULE_nonReserved;
	}
	public enterRule(listener: promql_parserListener): void {
	    if(listener.enterNonReserved) {
	 		listener.enterNonReserved(this);
		}
	}
	public exitRule(listener: promql_parserListener): void {
	    if(listener.exitNonReserved) {
	 		listener.exitNonReserved(this);
		}
	}
}
