package com.gluk.dagaz.rules.runtime;

import com.gluk.dagaz.api.exceptions.CheckException;
import com.gluk.dagaz.api.exceptions.EvaluationException;
import com.gluk.dagaz.api.rules.runtime.IEnvironment;
import com.gluk.dagaz.api.rules.runtime.IExpression;
import com.gluk.dagaz.api.rules.runtime.IValue;

public class CheckExpression extends BaseExpression {

	public IValue getValue(IEnvironment env) throws EvaluationException {
		if (args.size() != 1) {
			throw new RuntimeException("Bad arity [" + Integer.toString(args.size()) + "]");
		}
		boolean r = args.get(0).getValue(env).getBoolean();
		if (!r) {
			throw new CheckException("Check Exception");
		}
		return ConstantValue.createBoolean(r);
	}
	
	public void addArgument(IExpression arg) throws RuntimeException {
		if (args.size() == 1) {
			throw new RuntimeException("Bad arity");
		}
		super.addArgument(arg);
	}
}
