import { request } from './index';

// 获取code
export function getKey(query) {
  return request({
    url: 'security/getKey',
    method: 'get',
    data: query
  })
}
// 验证码
export function getCode(query) {
  return request({
    url: 'verificationCode/getCode',
    method: 'get',
    data: query
  })
}
// 登录 
export function login(query) {
  return request({
    url: 'userBase/userLogin',
    method: 'get',
    params: query
  })
}
export function loginOut(query) {
  return request({
    url: 'userBase/loginOut',
    method: 'get',
    params: query
  })
}

// 注册
export function userRegister(query) {
  return request({
    url: 'userBase/userRegister',
    method: 'get',
    params: query
  })
}
// 连接测试
export function connectionTest(query) {
  return request({
    url: 'databaseConnection/connectionTest',
    method: 'post',
    data: query
  })
}
// 创建连接
export function createConnection(query) {
  return request({
    url: 'databaseConnection/createConnection',
    method: 'post',
    data: query
  })
}
// 数据抽取
export function selectTableList(query) {
  return request({
    url: 'databaseConnection/selectTableList',
    method: 'post',
    data: query
  })
}

// 根据表名查询字段合数
export function getTableList(query) {
  return request({
    url: 'databaseConnection/selectRecordByTableName',
    method: 'post',
    params: query
  })
}

// 新建表格 
export function createNewTable(query, info) {
  return request({
    url: 'dataClean/createNewTable',
    method: 'post',
    params: query,
    data: info
  })
}

// 查询历史连接
export function selectConnectionList(query) {
  return request({
    url: 'databaseConnection/selectConnectionList',
    method: 'post',
    data: query,
  })
}

// 数据入库
export function dataLoading(query) {
  return request({
    url: 'dataClean/dataLoading',
    method: 'post',
    data: query,
    timeout: 300000
  })
}

// 创建清洗规则
export function createCleanRule(query) {
  return request({
    url: 'dataClean/createCleanRule',
    method: 'post',
    data: query,
  })
}


//  删除清洗规则 
export function deleteCleanRule(query) {
  return request({
    url: 'dataClean/deleteCleanRule',
    method: 'post',
    params: query,
  })
}

// 查询所有清洗规则
export function selectCleanRulesList(query) {
  return request({
    url: 'dataClean/selectCleanRulesList',
    method: 'get',
    params: query,
  })
}

// 新增奖项
export function addAwards(query) {
  return request({
    url: 'praise/newAwards',
    method: 'post',
    params: query,
  })
}

// 获奖记录表 
export function newAwardRecord(query) {
  return request({
    url: 'praiseRecord/newAwardRecord',
    method: 'post',
    params: query,
  })
}


// 数据清洗 
export function dataClean(query) {
  return request({
    headers: {
      "Content-Type": "application/json"
    },
    url: 'dataClean/bingRules',
    method: 'post',
    data: query,
  })
}

// 接口数据采集 
export function interfaceAcquisition(query) {
  return request({
    url: 'datasource/interfaceAcquisition',
    method: 'post',
    params: query,
    timeout: 300000
  })
}
//  获取所有奖项
export function getAwardLList(query) {
  return request({
    url: 'praise/selectAwardLList',
    method: 'post',
    params: query,
    timeout: 300000
  })
}


// 数据清洗
export function cleanData( data) {
  return request({
    url: 'dataClean/dataClean',
    method: 'post',
    data: data
  })
}

// 学员成绩分析
export function getStudentAchievement(query) {
  return request({
    url: 'BigDataController/open/selectPerformanceAnalysis',
    method: 'post',
    params: query,
    timeout: 300000
  })
}

// 查询大单位
export function selectOrganizationList(query) {
  return request({
    url: 'DataAnalysisController/selectOrganizationList',
    method: 'post',
    params: query,
  })
}

// 查询小单位
export function selectUnitList(query) {
  return request({
    url: 'DataAnalysisController/selectUnitList',
    method: 'post',
    params: query,
  })
}

// 查询单位列表
export function getMajorList(query) {
  return request({
    url: 'DataAnalysisController/selectMajorList',
    method: 'post',
    params: query,
  })
}

// 加权平均算法
export function OriginalReliability(query) {
  return request({
    url: 'DataAnalysisController/selectOriginalReliability',
    method: 'post',
    params: query,
  })
}

// 查询克朗巴赫α系数
export function CronbachCoefficient(query) {
  return request({
    url: 'DataAnalysisController/selectCronbachCoefficient',
    method: 'post',
    params: query,
  })
}

// apriori算法
export function apriori(query,data) {
  return request({
    url: 'DataAnalysisController/aprioriDataSet',
    method: 'post',
    params: query,
    data: data
  })
}

// kmeans算法 
export function kmeans(query,data) {
  return request({
    url: 'DataAnalysisController/kmeans',
    method: 'post',
    params: query,
    data: data,
  })
}

// 信度检验
export function cronbach(query) {
  return request({
    url: 'Evaluation/cronbach',
    method: 'post',
    params: query,
  })
}

// 查询数据集
export function selectDataset(query) {
  return request({
    url: 'DataAnalysisController/selectDataset',
    method: 'post',
    params: query,
  })
}

// logistic回归模型分析
export function logisticDataset(query) {
  return request({
    url: 'DataAnalysisController/logisticDataset',
    method: 'post',
    params: query,
  })
}


// logistic得到结果集
export function getLogisticResult(query,data) {
  return request({
    url: '/DataAnalysisController/getLogisticResult',
    method: 'post',
    params: query,
    data: data,
  })
}

// logistic得到结果集
export function getPredictionResult(query,data) {
  return request({
    url: 'DataAnalysisController/open/getPredictionResult',
    method: 'post',
    params: query,
    data: data,
  })
}

// 结果预测
export function selectResultPrediction(query) {
  return request({
    url: 'DataAnalysisController/selectResultPrediction',
    method: 'post',
    data: query,
  })
}


//  新增模板
export function addTemplate(query) {
  return request({
    url: 'template/insert',
    method: 'post',
    data: query,
  })
}

// 获取模板列表
export function getTemplateList(query) {
  return request({
    url: 'template/getList',
    method: 'get',
    params: query,
  })
}

//  删除模板
export function deleteTemplate(query) {
  return request({
    url: 'template/delete',
    method: 'delete',
    params: query,
  })
}

// 修改模板
export function updateTemplate(query) {
  return request({
    url: 'template/update',
    method: 'delete',
    params: query,
  })
}

// 查询清洗日志列表
export function getLogList(query) {
  return request({
    url: 'dataClean/selectCleanLog',
    method: 'post',
    params: query,
  })
}

// 查看日志详情
export function getLogById(query) {
  return request({
    url: 'dataClean/selectCleanLogById',
    method: 'post',
    params: query,
  })
}


// 获取树形结构数据
export function selectTree(query) {
  return request({
    url: 'DataAnalysisController/selectTree',
    method: 'post',
    params: query,
  })
}

// apriori进行计算
export function getAprioriResult(query,data) {
  return request({
    url: 'DataAnalysisController/getAprioriResult',
    method: 'post',
    params: query,
    data: data
  })
}
export function getAprioriResult1(query,data) {
  return request({
    url: 'DataAnalysisController/getAprioriResult1',
    method: 'post',
    params: query,
    data: data
  })
}

// kmeans准备数据集
export function kmeansDataSet(query,data) {
  return request({
    url: 'DataAnalysisController/kmeansDataSet',
    method: 'post',
    params: query,
    data: data
  })
}

// 生成报告
export function createReport(query) {
  return request({
    url: 'DataAnalysisController/createReport',
    method: 'post',
    params: query,
  })
}

// 下载报告
export function exportReport(query,data) {
  return request({
    url: 'DataAnalysisController/exportReport',
    method: 'post',
    params: query,
    data: data
  })
}


// 查询调查问卷列表
export function selectAnswerList(query) {
  return request({
    url: 'QuestionNaireController/open/selectAnswerList',
    method: 'post',
    data: query,
  })
}

// 根据ID查询调查问卷
export function selectAnswerById(query) {
  return request({
    url: 'QuestionNaireController/open/selectAnswerById',
    method: 'get',
    params: query,
  })
}


// ID3
export function getID3(query,data) {
  return request({
    url: 'DataAnalysisController/getId3Result',
    method: 'post',
    params: query,
    data: data,
  })
}


export function selectDegree(query) {
  return request({
    url: 'DataAnalysisController/selectDegree',
    method: 'post',
    params: query,
  })
}

// 查询学生入学年份
export function getYearsList(query) {
  return request({
    url: 'DataAnalysisController/yearList',
    method: 'get',
    params:query
  })
}

// 查询教师所有人员类别
export function getPersonType(query) {
  return request({
    url: 'DataAnalysisController/personnelCategory',
    method: 'get',
    params:query
  })
}

// 二次清洗
export function dataCleanTwo(query) {
  return request({
    url: '/dataClean/cleanTwo',
    method: 'post',
    data:query
  })
}

// 考核时间查询
export function getDataTime(query) {
  return request({
    url: '/dataClean/dataTime',
    method: 'get',
    params:query
  })
}

// 课程名称搜索
export function getCourseName(query) {
  console.log(query);
  return request({
    url: '/dataClean/courseName',
    method: 'post',
    params:query
  })
}

// 获奖名称搜索
export function getAwardName(query) {
  return request({
    url: '/dataClean/awardName',
    method: 'post',
    params:query
  })
}

// 获奖时间查询
export function getAwardTime(query) {
  return request({
    url: '/dataClean/awardTime',
    method: 'get',
    params:query
  })
}

// 体能成绩 时间查询
export function getSemesterTime(query) {
  return request({
    url: '/dataClean/semesterTime',
    method: 'get',
    params:query
  })
}
// 学员入学年份查询
export function getStudentTime(query) {
  return request({
    url: '/dataClean/studentTime',
    method: 'get',
    params:query
  })
}

// 学员培养层次查询
export function getLevel(query) {
  return request({
    url: '/dataClean/level',
    method: 'get',
    params:query
  })
}

// 学员类别查询
export function getCategory(query) {
  return request({
    url: '/dataClean/category',
    method: 'get',
    params:query
  })
}

// 二次清洗
export function claTwo(query) {
  return request({
    url: '/dataClean/claTwo',
    method: 'post',
    data:query
  })
}

// 确认清洗
export function doneClean(query) {
  return request({
    url: '/dataClean/inster',
    method: 'post',
    params: query
  })
}

//学员类别

export function getStudentType(query) {
  return request({
    url: '/DataAnalysisController/studentList',
    method: 'get',
    params: query
  })
}


export function cacheFetch(query) {
  return request({
    url: '/dataClean/cacheFetch',
    method: 'get',
    params: query
  })
}

// 获取系统信息
export function getSystemData(query) {
  return request({
    url: '/systemData/menu',
    method: 'get',
    params: query
  })
}

// 获取清洗规则转换
export function getConversionRules(query) {
  return request({
    url: '/ConversionRule/advancedQuery',
    method: 'get',
    params: query
  })
}

// 删除清洗规则转换
export function removeConversionRules(query) {
  return request({
    url: '/ConversionRule/deleteConversionRuleDict',
    method: 'DELETE',
    params: query
  })
}

// 新增清洗规则转换
export function saveConversionRules(query) {
  return request({
    url: '/ConversionRule/newlyAdded',
    method: 'POST',
    data: query
  })
}

// 清洗转换规则详情查询接口
export function getDetail(query) {
  return request({
    url: '/ConversionRule/advancedQueryDetail',
    method: 'get',
    params: query
  })
}

// 删除清洗规则转换详情
export function deleteDetail(query) {
  return request({
    url: '/ConversionRule/deleteDetil',
    method: 'DELETE',
    params: query
  })
}

// 清洗规则转换详情编辑新增
export function saveDetail(query) {
  return  request({
    url: '/ConversionRule/addRuleDetail',
    method: 'post',
    data: query
  })
}

// 字典查询
export function getDict(query) {
  return  request({
    url: '/sys/dict/list',
    method: 'post',
    params: query
  })
}

// 新增字典 
export function addDict(query) {
  return  request({
    url: '/sys/dict/add',
    method: 'post',
    data: query
  })
}

// 修改字典 
export function editDict(query) {
  return  request({
    url: '/sys/dict/edit',
    method: 'post',
    data: query
  })
}

// 删除字典 
export function removeDict(query) {
  return  request({
    url: `/sys/dict/delete?id=${query.id}`,
    method: 'get',
    query: query
  })
}

// 编码校验
export function checkCode(query) {
  return  request({
    url: `/sys/dict/check`,
    method: 'get',
    params: query
  })
}

// 字典彻底删除 
export function removeRecycleDict(query) {
  return  request({
    url: `/sys/dict/deletePhysic`,
    method: 'get',
    params: query
  })
}

// 字典取回字段
export function backDict(query) {
  return  request({
    url: `/sys/dict/back`,
    method: 'get',
    params: query
  })
}

// 查询字典内容
export function getDictItem(query) {
  return  request({
    url: `/sys/dictItem/list`,
    method: 'get',
    params: query
  })
}

// 新增字典内容
export function addDictItem(query) {
  return  request({
    url: `/sys/dictItem/add`,
    method: 'POST',
    data: query
  })
}

// 修改字典内容
export function editDictItem(query) {
  return  request({
    url: `/sys/dictItem/edit`,
    method: 'POST',
    data: query
  })
}

// 删除字典内容 
export function removeDictItem(query) {
  return  request({
    url: `/sys/dictItem/delete`,
    method: 'get',
    params: query
  })
}

// 字典导出接口 
export function exportDict(query) {
  return  request({
    url: `/sys/dict/exportXls`,
    method: 'GET',
    params: query
  })
}