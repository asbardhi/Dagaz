package com.gluk.dagaz.parser;

import com.gluk.dagaz.api.model.IReserved;
import com.gluk.dagaz.api.runtime.ICommand;
import com.gluk.dagaz.exceptions.CommonException;
import com.gluk.dagaz.runtime.CommandFactory;

public class ExpressionBuilder extends AbstractBuilder {
	
	private String name = null;
	private int arity = 0;

	@Override
	public void open(String name) throws CommonException {
		this.name = name;
	}
	
	@Override
	public void close() throws CommonException {
		ICommand cmd = CommandFactory.getInstance().createCommand(name, build);
		build.addCommand(cmd);
		cmd.addArgument(arity); 
	}
	
	@Override
	public void addOperand(String name) throws CommonException {
		ICommand getCommand = CommandFactory.getInstance().createCommand(IReserved.CMD_GET, build);
		build.addCommand(getCommand);
		getCommand.addArgument(name);
		arity++;
	}

	@Override
	public void closeChild() throws CommonException {
		super.closeChild();
		arity++;
	}
}
