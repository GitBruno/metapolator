define([
    'intern!object'
  , 'intern/chai!assert'
  , 'Atem-MOM/errors'
  , 'Atem-MOM/MOM/_Node'
  , 'Atem-MOM/MOM/Univers'
  , 'Atem-MOM/MOM/Master'
  , 'Atem-MOM/MOM/Glyph'
  , 'Atem-MOM/MOM/_Contour'
  , 'Atem-MOM/MOM/PenStroke'
  , 'Atem-MOM/MOM/PenStrokeCenter'
], function (
    registerSuite
  , assert
  , errors
  , _Node
  , Univers
  , Master
  , Glyph
  , _Contour
  , PenStroke
  , PenStrokeCenter
) {
    "use strict";
    registerSuite({
        name: 'MOM relationship',
        Node_: function() {
              var univers = new Univers()
                , master = new Master()
                , glyph = new Glyph()
                , penStroke = new PenStroke()
                , penStrokePoint = new PenStrokeCenter()
                ;

            assert.isTrue(univers instanceof _Node);
            assert.isTrue(univers.isMOMNode(univers));
            assert.isFalse(univers.isMOMNode({}));
            assert.isTrue(univers.isMOMNode(master));
            assert.isTrue(univers.qualifiesAsChild(master));

            univers.add(master);
            assert.strictEqual(univers, master.parent);
            assert.isTrue(univers.isMOMNode(glyph));

            assert.throws(
                univers.add.bind(univers, glyph)
              , errors.OMA
              , /<MOM Univers.*> doesn\'t accept <MOM Glyph.*> as a child object./
            );

            assert.isTrue(master.qualifiesAsChild(glyph));
            master.add(glyph);
            assert.strictEqual(master, glyph.parent);

            assert.isTrue(penStroke instanceof _Contour);
            assert.isTrue(glyph.qualifiesAsChild(penStroke));
            glyph.add(penStroke);
            assert.strictEqual(glyph, penStroke.parent);

            assert.isTrue(penStroke.qualifiesAsChild(penStrokePoint));
            penStroke.add(penStrokePoint);
            assert.strictEqual(penStroke, penStrokePoint.parent);
        }
    });
});
