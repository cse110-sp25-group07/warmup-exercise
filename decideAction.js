function decideAction(hand, handValue, opts = {}) {
    if (opts.decideFn) {
        return opts.decideFn();
    }
    const threshold = opts.minStand ?? 17;
    return handValue < threshold ? 'hit' : 'stand';
}