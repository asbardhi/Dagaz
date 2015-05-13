package com.gluk.dagaz.tests.converter;

import com.gluk.dagaz.api.application.IApplication;
import com.gluk.dagaz.api.io.IDataManager;
import com.gluk.dagaz.api.random.IRandomFactory;
import com.gluk.dagaz.api.rules.functions.IFunctionManager;
import com.gluk.dagaz.api.state.ISession;

public abstract class BaseApplication implements IApplication {

	public IFunctionManager getFunctionManager() {
		return null;
	}

	public IDataManager getDataManager() {
		return FileManager.getInstance();
	}

	public ISession getStateManager() {
		return null;
	}

	public IRandomFactory getRandomFactory() {
		return null;
	}
}
