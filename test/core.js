describe('core', function () {
    'use strict';

    var core = require('../lib/core');
    var expect = require('must');
    var path = require('path');
    var target;

    describe('parsePath()', function () {
        describe('корректно парсит строку типа', function () {
            describe('блок', function () {
                before(function () {
                    target = core.parsePath('a');
                });

                it('имеет поля type равное block', function () {
                    expect(target.type).to.be('block');
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
                    target = core.parsePath('a_m');
                });

                it('имеет поля type равное mod', function () {
                    expect(target.type).to.be('mod');
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
                    target = core.parsePath('a_m_v');
                });

                it('имеет поля type равное mod', function () {
                    expect(target.type).to.be('mod');
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
                    target = core.parsePath('a__b');
                });

                it('имеет поля type равное elem', function () {
                    expect(target.type).to.be('elem');
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
                    target = core.parsePath('a__e_m');
                });

                it('имеет поля type равное elemmod', function () {
                    expect(target.type).to.be('elemmod');
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
                    target = core.parsePath('a__e_m_v');
                });

                it('имеет поля type равное elemmod', function () {
                    expect(target.type).to.be('elemmod');
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
                    core.parsePath('_a');
                } catch(e) {
                    expect(e.toString()).to.be.equal('SyntaxError: Unknown type of argument: "_a"');
                }
            });
        });
    });

    describe('resolveName()', function () {
        it('корректно резолвит имя для блока', function () {
            var name = 'a';
            expect(core.resolveName(core.parsePath(name)))
                .to.be(name);
        });

        it('корректно резолвит имя для модификатора', function () {
            var name = 'a_m';
            expect(core.resolveName(core.parsePath(name)))
                .to.be(name);
        });

        it('корректно резолвит имя для элемента', function () {
            var name = 'a__e';
            expect(core.resolveName(core.parsePath(name)))
                .to.be(name);
        });

        it('корректно резолвит имя для элемента модификатора', function () {
            var name = 'a__e_m';
            expect(core.resolveName(core.parsePath(name)))
                .to.be(name);
        });
    });

    describe('resolvePath()', function () {
        it('корректно резолвит путь для блока', function () {
            expect(core.resolvePath(core.parsePath('a')))
                .to.be(path.resolve('a'));
        });

        it('корректно резолвит путь для модификатора', function () {
            expect(core.resolvePath(core.parsePath('a_m_v')))
                .to.be(path.resolve('a', '_m'));
        });

        it('корректно резолвит путь для элемента', function () {
            expect(core.resolvePath(core.parsePath('a__e')))
                .to.be(path.resolve('a', '__e'));
        });

        it('корректно резолвит путь для элемента модификатора', function () {
            expect(core.resolvePath(core.parsePath('a__e_m_v')))
                .to.be(path.resolve('a', '__e', '_m'));
        });
    });
});
