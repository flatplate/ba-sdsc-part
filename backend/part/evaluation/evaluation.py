import operator
from abc import ABC, abstractmethod
from statistics import mean
from typing import List

from part.model.evaluation import Evaluation, ResultClass, MetricCondition
from part.model.question import Question, MatrixQuestion, DataQuestion, AnswerQuestion
from part.model.response import QuestionResponse, MetricScore

from itertools import groupby


class IntermediaryMetricScoreResult:
    def __init__(self, metricName: str, weight: float, score: float):
        self.metricName = metricName
        self.weight = weight
        self.score = score

    def __str__(self):
        return "IntermediaryMetricScoreResult{{metricName={}, weight={}, score={}}}".format(self.metricName,
                                                                                            self.weight,
                                                                                            self.score)


def reduceIntermediaryResultGroup(scoresGrouped: List[IntermediaryMetricScoreResult]) -> float:
    groupCopy = [score for score in scoresGrouped]
    weights = [result.weight for result in groupCopy]
    weightedScores = [result.weight * result.score for result in groupCopy]
    weightSum = sum(weights)
    weightedSum = sum(weightedScores)
    if weightSum != 0:
        return weightedSum / weightSum


def reduceIntermediaryMetricScoreResults(scores: List[IntermediaryMetricScoreResult]) -> List[MetricScore]:
    groups = groupby(sorted(scores, key=lambda x: x.metricName), lambda x: x.metricName)
    return [MetricScore.fromMetricString(key, reduceIntermediaryResultGroup(group)) for key, group in groups]


def questionHasMetricEffects(question: Question) -> bool:
    for metricEffectGroup in question._metricEffects:
        if metricEffectGroup.metricEffects:
            return True


def calculateListValueWithStrategy(strategy: str, scores: List[float]):
    if strategy == "min":
        return min(scores)
    if strategy == "max":
        return max(scores)
    if strategy == "avg":
        return mean(scores)
    if strategy == "first":
        return scores[0]
    if strategy == "last":
        return scores[-1]

def calculateResponseMetricScore(response: QuestionResponse) -> List[IntermediaryMetricScoreResult]:
    if isinstance(response.question, MatrixQuestion):
        answerValues = {answer.value: answer.numericalValue for answer in response.question.answers}
        return [
            IntermediaryMetricScoreResult(metricEffect.metric.name, metricEffect.weight,
                                          answerValues[response.answer["data"][metricEffectGroup.fieldName]])
            for metricEffectGroup in response.question._metricEffects
            for metricEffect in metricEffectGroup.metricEffects
            if response.answer["data"][metricEffectGroup.fieldName]
        ]
    elif isinstance(response.question, DataQuestion):
        return [
            IntermediaryMetricScoreResult(metricEffect.metric.name, metricEffect.weight,
                                          response.answer[metricEffectGroup.fieldName])
            for metricEffectGroup in response.question._metricEffects
            for metricEffect in metricEffectGroup.metricEffects
            if response.answer and metricEffectGroup.fieldName in response.answer
        ]
    elif isinstance(response.question, AnswerQuestion):
        answerValues = {answer.value: answer.numericalValue for answer in response.question.answers}
        return [
            IntermediaryMetricScoreResult(metricEffect.metric.name,
                                          metricEffect.weight,
                                          calculateListValueWithStrategy(
                                              metricEffect.strategy,
                                              [answerValues[value] for value in response.answer["data"]]
                                          ) if isinstance(response.answer["data"], list)
                                          else answerValues[response.answer["data"]])
            for metricEffectGroup in response.question._metricEffects
            for metricEffect in metricEffectGroup.metricEffects
            if response.answer
        ]
    return []


def calculateMetricScores(responses: List[QuestionResponse]) -> List[MetricScore]:
    responsesWithMetricEffects = [response for response in responses
                                  if questionHasMetricEffects(response.question)]
    responseMetricScores = [metricScore
                            for response in responsesWithMetricEffects
                            for metricScore in calculateResponseMetricScore(response)
                            if response is not None]
    reducedScores = reduceIntermediaryMetricScoreResults(responseMetricScores)
    print("Reduced Scores", reducedScores)
    return reducedScores


def calculateMetricConditionValue(metricScores: List[MetricScore], condition: MetricCondition) -> float:
    metricScoresDict = {metricScore.metric.name: metricScore.score for metricScore in metricScores}
    if condition.metric == "avg":
        return mean(metricScoresDict.values())
    if condition.metric == "min":
        return min(metricScoresDict.values())
    if condition.metric == "max":
        return max(metricScoresDict.values())
    return metricScoresDict[condition.metric]


def evaluateResultClassCondition(metricScores: List[MetricScore], condition: MetricCondition) -> bool:
    value = calculateMetricConditionValue(metricScores, condition)
    op = operator.lt if condition.operation == "<" else operator.gt
    return op(value, condition.value)


def evaluateResultClass(metricScores: List[MetricScore], resultClass: ResultClass) -> bool:
    return all([evaluateResultClassCondition(metricScores, condition) for condition in resultClass.conditions])


def selectResultClass(metricScores: List[MetricScore], evaluation: Evaluation) -> ResultClass:
    resultClasses = evaluation.resultClasses
    for resultClass in resultClasses:
        if evaluateResultClass(metricScores, resultClass):
            return resultClass


class AbstractBaseEvaluation(ABC):
    def __init__(self, surveyMeta):
        self.surveyMeta = surveyMeta
        self.init()

    @abstractmethod
    def init(self):
        pass
