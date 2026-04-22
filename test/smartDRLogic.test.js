const test = require('node:test');
const assert = require('node:assert/strict');
const { findItemById, buildReportState } = require('../smartDRLogic');

const sampleData = {
    chest_common: [
        { id: 'c_eff', desc: '胸腔积液描述', dx: '胸腔积液', tag: 'badge-ct', head: '🟧 建议 CT/超声', text: '建议进一步检查。' }
    ],
    bone_trauma: [
        { id: 'b_dest', desc: '骨质破坏描述', dx: '骨质破坏 (恶性)', tag: 'badge-critical', head: '🔴 危急 MRI', text: '尽快处理。' }
    ]
};

test('findItemById finds item across groups', () => {
    const item = findItemById(sampleData, 'b_dest');
    assert.equal(item.dx, '骨质破坏 (恶性)');
});

test('findItemById returns null when item is missing', () => {
    const item = findItemById(sampleData, 'missing');
    assert.equal(item, null);
});

test('buildReportState creates findings/impression/recommendation output', () => {
    const result = buildReportState(sampleData, new Set(['c_eff', 'b_dest']));

    assert.equal(result.hasSelection, true);
    assert.deepEqual(result.findings, ['胸腔积液描述', '骨质破坏描述']);
    assert.deepEqual(result.impressions, ['胸腔积液', '骨质破坏 (恶性)']);
    assert.equal(result.recommendations.length, 2);
    assert.deepEqual(result.criticalNames, ['骨质破坏 (恶性)']);
});

test('buildReportState ignores unknown ids and returns empty state when no valid data is selected', () => {
    const result = buildReportState(sampleData, new Set(['unknown-id']));

    assert.equal(result.hasSelection, false);
    assert.deepEqual(result.findings, []);
    assert.deepEqual(result.impressions, []);
    assert.deepEqual(result.recommendations, []);
    assert.deepEqual(result.criticalNames, []);
});
