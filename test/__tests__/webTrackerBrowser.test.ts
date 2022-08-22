import { WebTrackerBrowser } from '../../src';

describe('webTrackerBrowser test', () => {
  const wtb = new WebTrackerBrowser({
    host: process.env.WTB_HOST ?? '',
    protocol: 'http',
    projectId: process.env.WTB_PROJECT_ID ?? '',
    topicId: process.env.WTB_TOPIC_ID ?? '',
    source: 'yk-test',
  });
  test('send single log', async () => {
    await wtb.send({
      single_1: '1',
      single_2: '2',
    })
  });

  test('send batch logs immediately', async () => {
    await wtb.sendBatchLogsImmediate( [{
      batch_1: '01',
      batch_2: '02',
    }, {
      batch_1: '11',
      batch_2: '12',
    }]);

    await wtb.sendBatchLogsImmediate([{
      batch_1: 'lz4_01',
      batch_2: 'lz4_02',
    }, {
      batch_1: 'lz4_11',
      batch_2: 'lz4_12',
    }]);
  });

  test('send batch logs async: timeout', async () => {
    const onSuccessCallback = jest.fn((logs: Record<string, any>[]) => {
      console.log('onSuccess', logs);
    });
    wtb.sendBatchLogs([{
      async_batch_1: 'async_batch_1',
      async_batch_2: 'async_batch_2',
    }], {
      onSuccess: onSuccessCallback,
    });
    wtb.sendBatchLogs([{
      async_batch_3: 'async_batch_3',
      async_batch_4: 'async_batch_4',
    }], {
      onSuccess: onSuccessCallback,
    });

    expect(onSuccessCallback.mock.calls.length).toBe(0);

    await new Promise((resolve) => {
      setTimeout(resolve, 8 * 1000);
    });

    expect(onSuccessCallback.mock.calls.length).toBe(0);
    await new Promise((resolve) => {
      setTimeout(resolve, 4 * 1000);
    });
    expect(onSuccessCallback.mock.calls.length).toBe(1);
    expect(onSuccessCallback.mock.calls[0][0].length).toBe(2);

  });

  test('send batch logs async: limit out', async () => {
    const onSuccessCallback = jest.fn((logs: Record<string, any>[]) => {
      console.log('onSuccess', logs);
    });
    wtb.sendBatchLogs([{
      1: '1',
    }, {
      2: '2',
    }, {
      3: '3',
    }], {
      onSuccess: onSuccessCallback,
    });
    expect(onSuccessCallback.mock.calls.length).toBe(0);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    expect(onSuccessCallback.mock.calls.length).toBe(0);

    wtb.sendBatchLogs([{
      4: '4',
    }, {
      5: '5',
    }, {
      6: '6',
    }], {
      onSuccess: onSuccessCallback,
    });

    expect(onSuccessCallback.mock.calls.length).toBe(0);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    expect(onSuccessCallback.mock.calls.length).toBe(0);
    wtb.sendBatchLogs([{
      7: '7',
    }, {
      8: '8',
    }, {
      9: '9',
    }, {
      10: '10'
    }, {
      11: '11',
    }], {
      onSuccess: onSuccessCallback,
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 2 * 1000);
    });
    expect(onSuccessCallback.mock.calls.length).toBe(1);
    expect(onSuccessCallback.mock.calls[0][0].length).toBe(11);

  });

  test('send batch logs async: different Source|ProjectId|TopicId', async () => {
    const onSuccess_1 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs_1', logs);
    });
    const onSuccess_2 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs_2', logs);
    });

    wtb.sendBatchLogs([{
      1: '1',
    }], {
      onSuccess: onSuccess_1,
    });

    wtb.sendBatchLogs([{
      2: '2',
    }, {
      3: '3',
    }, {
      4: '4',
    }], {
      onSuccess: onSuccess_1,
    });

    wtb.sendBatchLogs([{
      1: '1',
    }, {
      2: '2',
    }, {
      3: '3',
    }, {
      4: '4',
    }, {
      5: '5',
    }, {
      6: '6',
    }, {
      7: '7',
    }, {
      8: '8',
    }, {
      9: '9',
    }, {
      10: '10',
    }], {
      onSuccess: onSuccess_2,
    });

    expect(onSuccess_1.mock.calls.length).toBe(0);
    expect(onSuccess_2.mock.calls.length).toBe(0);

    await new Promise((resolve) => {
      setTimeout(resolve, 2 * 1000);
    });

    expect(onSuccess_2.mock.calls.length).toBe(1);
    expect(onSuccess_2.mock.calls[0][0].length).toBe(14);
    expect(onSuccess_1.mock.calls.length).toBe(0);

    await new Promise((resolve) => {
      setTimeout(resolve, 10 * 1000);
    });
    expect(onSuccess_1.mock.calls.length).toBe(0);
  });

  test('send batch logs async: flush by sendBatchLogsImmediate', async () => {
    const onSuccess_1 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs', logs);
    });
    const onSuccess_2 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs', logs);
    });
    const onSuccess_3 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs', logs);
    });

    const onSuccess_4 = jest.fn((logs: Record<string, any>[]) => {
      console.log('logs', logs);
    });
    const onSuccess_41 = jest.fn(() => {
    })
    const onSuccess_42 = jest.fn(() => {
    })
    const onSuccess_43 = jest.fn(() => {
    })
    wtb.sendBatchLogs([{
      1: '1',
    }], {
      onSuccess: onSuccess_1,
    });

    wtb.sendBatchLogs([{
      1: '1',
    }], {
      onSuccess: onSuccess_2,
    });

    wtb.sendBatchLogs([{
      1: '1',
    }], {
      onSuccess: onSuccess_3,
    });

    wtb.sendBatchLogs([{
      1: '1',
    }], {
      onSuccess: onSuccess_4,
    });

    await wtb.sendBatchLogsImmediate([{
      1: '1',
    }]).then(() => {
      onSuccess_41();
    });

    await wtb.sendBatchLogsImmediate([{
      1: '1',
    }]).then(() => {
      onSuccess_42();
    });
    await wtb.sendBatchLogsImmediate([{
      1: '1',
    }]).then(() => {
      onSuccess_43();
    });

    expect(onSuccess_1.mock.calls.length).toBe(0);
    expect(onSuccess_2.mock.calls.length).toBe(0);
    expect(onSuccess_3.mock.calls.length).toBe(0);
    expect(onSuccess_4.mock.calls.length).toBe(0);
    expect(onSuccess_41.mock.calls.length).toBe(1);
    expect(onSuccess_42.mock.calls.length).toBe(1);
    expect(onSuccess_43.mock.calls.length).toBe(1);
    await new Promise((resolve) => {
      setTimeout(resolve, 12 * 1000);
    });

    expect(onSuccess_1.mock.calls.length).toBe(0);
    expect(onSuccess_2.mock.calls.length).toBe(0);
    expect(onSuccess_3.mock.calls.length).toBe(0);
    expect(onSuccess_4.mock.calls.length).toBe(0);
    expect(onSuccess_41.mock.calls.length).toBe(1);
    expect(onSuccess_42.mock.calls.length).toBe(1);
    expect(onSuccess_43.mock.calls.length).toBe(1);

  })
})
