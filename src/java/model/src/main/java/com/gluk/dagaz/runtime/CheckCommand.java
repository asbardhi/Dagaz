package com.gluk.dagaz.runtime;

import com.gluk.dagaz.api.state.IDeferredCheck;
import com.gluk.dagaz.api.state.IEnvironment;
import com.gluk.dagaz.exceptions.CommonException;

public class CheckCommand extends AbstractCommand { // ? --

	@Override
	public boolean execute(IDeferredCheck state, IEnvironment env) throws CommonException {
		super.execute(state, env);
		if (processor.getStack().isEmpty()) {
			throw new CommonException("Stack is empty");
		}
		return processor.getStack().pop().getBoolean();
	}
}