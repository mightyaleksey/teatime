describe('utils', function () {
    'use strict';

    var expect = require('must');
    var utils = require('../lib/utils');

    describe('parsePath()', function () {
        describe('корректно парсит строку типа', function () {
            var target;

            describe('блок', function () {
                before(function () {
                    target = utils.parsePath('a');
                });

                it('имеет поля bem равное block', function () {
                    expect(target.bem).to.be('block');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('');
                });
            });

            describe('модификатор', function () {
                before(function () {
                    target = utils.parsePath('a_m');
                });

                it('имеет поля bem равное mod', function () {
                    expect(target.bem).to.be('mod');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('_m');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('');
                });
            });

            describe('модификатор с некоторым значением', function () {
                before(function () {
                    target = utils.parsePath('a_m_v');
                });

                it('имеет поля bem равное mod', function () {
                    expect(target.bem).to.be('mod');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('_m');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('_v');
                });
            });

            describe('элемент', function () {
                before(function () {
                    target = utils.parsePath('a__b');
                });

                it('имеет поля bem равное elem', function () {
                    expect(target.bem).to.be('elem');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('__b');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('');
                });
            });

            describe('модификатор элемента', function () {
                before(function () {
                    target = utils.parsePath('a__e_m');
                });

                it('имеет поля bem равное elemmod', function () {
                    expect(target.bem).to.be('elemmod');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('__e');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('_m');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('');
                });
            });

            describe('модификатор элемента с некоторым значением', function () {
                before(function () {
                    target = utils.parsePath('a__e_m_v');
                });

                it('имеет поля bem равное elemmod', function () {
                    expect(target.bem).to.be('elemmod');
                });

                it('имеет поле block', function () {
                    expect(target.block).to.be('a');
                });

                it('имеет пустое поле elem', function () {
                    expect(target.elem).to.be('__e');
                });

                it('имеет пустое поле mod', function () {
                    expect(target.mod).to.be('_m');
                });

                it('имеет пустое поле val', function () {
                    expect(target.val).to.be('_v');
                });
            });
        });

        describe('бросит исключение для неизвестного типа', function () {
            it('SyntaxError', function () {
                try {
                    utils.parsePath('_a');
                } catch(e) {
                    expect(e.toString()).to.be.equal('SyntaxError: Unknown type of argument: "_a"');
                }
            });
        });
    });
});
