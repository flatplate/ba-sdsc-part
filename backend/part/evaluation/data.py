from abc import ABC, abstractmethod

dataEvaluationStrategies = {}


def addDataEvaluationStrategy(clas):
    clas.checkFields()
    dataEvaluationStrategies[clas.name] = clas


def getDataEvaluationStrategies():
    return dataEvaluationStrategies.values()


def getDataEvaluationStrategyByName(name):
    if name in dataEvaluationStrategies:
        return dataEvaluationStrategies[name]
    return None


class AbstractDataEvaluationStrategy(ABC):
    name = ""
    visibleName = ""
    description = ""
    author = ""
    outputs = []
    optionalMetadata = {}

    @staticmethod
    @abstractmethod
    def process(df, metadata):
        pass

    @classmethod
    def checkFields(cls):
        if not cls.name:
            raise Exception("Something")  # TODO
        if not cls.visibleName:
            raise Exception("Something")


class BasicDataEvaluationStrategy(AbstractDataEvaluationStrategy):
    name = "BasicDataEvaluationStrategy"
    visibleName = "Basic Data Evaluation Strategy"
    description = "This is a basic data evaluation strategy for testing purposes. It only calculates the ratio of" \
                  "None values in the data."
    author = "Ural Bayhan"
    outputs = ["noneRatio", "somethingElse"]
    optionalMetadata = {}

    @staticmethod
    def process(df, metadata):
        return {"noneRatio": 1 - df.isnull().mean().mean(), "somethingElse": 0}


class TestDataEvaluationStrategy(AbstractDataEvaluationStrategy):
    name = "TestDataEvaluationStrategy"
    visibleName = "Test Data Evaluation Strategy"
    description = "This is a basic data evaluation strategy for testing purposes. It only calculates the ratio of" \
                  "None values in the data."
    author = "Ural Bayhan 2"
    outputs = ["noneRatio", "somethingElse2"]
    optionalMetadata = {}

    @staticmethod
    def process(df, metadata):
        return {"noneRatio": df.isnull().mean().mean(), "somethingElse2": 0}


addDataEvaluationStrategy(BasicDataEvaluationStrategy)
addDataEvaluationStrategy(TestDataEvaluationStrategy)
