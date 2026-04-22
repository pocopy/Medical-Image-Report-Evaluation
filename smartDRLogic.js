(function (globalScope) {
    function findItemById(data, id) {
        const groups = Object.values(data || {});
        for (const items of groups) {
            const found = items.find(item => item.id === id);
            if (found) return found;
        }
        return null;
    }

    function buildReportState(data, selectedIds) {
        const findings = [];
        const impressions = [];
        const recommendations = [];
        const criticalNames = [];

        for (const id of selectedIds || []) {
            const item = findItemById(data, id);
            if (!item) continue;

            findings.push(item.desc);
            impressions.push(item.dx);
            recommendations.push({
                tag: item.tag,
                head: item.head,
                dx: item.dx,
                text: item.text
            });

            if (item.tag === 'badge-critical') criticalNames.push(item.dx);
        }

        return {
            hasSelection: findings.length > 0,
            findings,
            impressions,
            recommendations,
            criticalNames
        };
    }

    const api = { findItemById, buildReportState };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    globalScope.smartDRLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
