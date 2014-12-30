package com.gluk.dagaz.tests.scripting;

import org.apache.log4j.Logger;

import com.gluk.dagaz.api.rules.board.IBoardConfiguration;
import com.gluk.dagaz.api.rules.runtime.IEnvironment;
import com.gluk.dagaz.api.rules.runtime.IFunction;
import com.gluk.dagaz.api.rules.runtime.IFunctionList;
import com.gluk.dagaz.rules.parser.CodeConfigurator;
import com.gluk.dagaz.rules.parser.Configuration;
import com.gluk.dagaz.rules.runtime.EnvironmentProxy;

public class Scripting extends BaseApplication {

    private static final Logger LOGGER = Logger.getLogger(Scripting.class);

    private final static String SCRIPT_SCOPE      = "./drf";
	private final static String SCRIPT_NAME       = "factorial.drf";
    private final static String TRANSFORM_SCOPE   = "../../../xslt";
    private final static String BASE_TRANSFORM    = "drf-to-internal.xsl";

    public static void main(String[] args) {
		Scripting script = new Scripting();
		script.exec();
	}

	public void exec() {
		try {
			Configuration conf = new Configuration(this, SCRIPT_NAME);
			conf.setDocumentScope(SCRIPT_SCOPE);
			conf.setTransformationScope(TRANSFORM_SCOPE);
			conf.addTransformation(BASE_TRANSFORM);
			
			CodeConfigurator code = new CodeConfigurator(this, conf.getDocument());
			code.initApplication();
			IFunctionList fl = getFunctionList();
			IFunction f = fl.getFunction("main@0");
			
			IBoardConfiguration board = new Board();
			IEnvironment env = new Environment();
			IEnvironment proxy = new EnvironmentProxy(env, board);
			f.getExpression().getValue(proxy);
		} catch (Exception e) {
			LOGGER.fatal(e.toString());
		}
	}
}